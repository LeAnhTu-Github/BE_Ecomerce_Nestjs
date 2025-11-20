import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../service/prisma.service";
import { REQUEST } from "@nestjs/core";
import { SessionRequest } from "../model/request.model";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { ENTITY_NOT_FOUND } from "../lib/error-messages";

@Injectable()
export class CartService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private readonly request: SessionRequest,
  ) {}

  private get userId(): number {
    if (!this.request.user?.id) {
      throw new UnauthorizedException();
    }

    return this.request.user.id;
  }

  private cartInclude() {
    return {
      items: {
        include: {
          product: {
            include: { images: true, color: true, size: true },
          },
        },
      },
    };
  }

  private async ensureCart(storeId: string) {
    const existing = await this.prismaService.cart.findFirst({
      where: { storeId, userId: this.userId },
      include: this.cartInclude(),
    });

    if (existing) {
      return existing;
    }

    return this.prismaService.cart.create({
      data: { storeId, userId: this.userId },
      include: this.cartInclude(),
    });
  }

  getCart(storeId: string) {
    return this.prismaService.cart.findFirst({
      where: { storeId, userId: this.userId },
      include: this.cartInclude(),
    });
  }

  async addItem(addCartItemDto: AddCartItemDto) {
    const { storeId, productId, quantity } = addCartItemDto;

    const product = await this.prismaService.product.findFirst({
      where: { id: productId, storeId, isArchived: false },
    });

    if (!product) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Product", "id"));
    }

    const cart = await this.ensureCart(storeId);

    const existingItem = await this.prismaService.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await this.prismaService.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await this.prismaService.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getCart(storeId);
  }

  private async ensureItemOwnership(itemId: string) {
    const item = await this.prismaService.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });

    if (!item || item.cart.userId !== this.userId) {
      throw new NotFoundException(ENTITY_NOT_FOUND("CartItem", "id"));
    }

    return item;
  }

  async updateItem(itemId: string, dto: UpdateCartItemDto) {
    const item = await this.ensureItemOwnership(itemId);

    await this.prismaService.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });

    return this.getCart(item.cart.storeId);
  }

  async removeItem(itemId: string) {
    const item = await this.ensureItemOwnership(itemId);

    await this.prismaService.cartItem.delete({
      where: { id: item.id },
    });

    return this.getCart(item.cart.storeId);
  }
}

