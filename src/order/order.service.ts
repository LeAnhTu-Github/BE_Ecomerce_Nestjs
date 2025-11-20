import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../service/prisma.service";
import { REQUEST } from "@nestjs/core";
import { SessionRequest } from "../model/request.model";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { ENTITY_NOT_FOUND } from "../lib/error-messages";

@Injectable()
export class OrderService {
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

  private orderInclude() {
    return {
      orderItems: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    };
  }

  async create(createOrderDto: CreateOrderDto) {
    const { storeId, cartId, phone, address } = createOrderDto;

    const cart = await this.prismaService.cart.findFirst({
      where: { id: cartId, storeId, userId: this.userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException("Cart is empty or not found");
    }

    return this.prismaService.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          storeId,
          userId: this.userId,
          phone,
          address,
          orderItems: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: this.orderInclude(),
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  findStoreOrders(storeId: string) {
    return this.prismaService.order.findMany({
      where: { storeId },
      include: this.orderInclude(),
      orderBy: { createdAt: "desc" },
    });
  }

  findMyOrders() {
    return this.prismaService.order.findMany({
      where: { userId: this.userId },
      include: this.orderInclude(),
      orderBy: { createdAt: "desc" },
    });
  }

  private async ensureOrder(id: string, storeId?: string) {
    const order = await this.prismaService.order.findFirst({
      where: {
        id,
        ...(storeId && { storeId }),
      },
      include: this.orderInclude(),
    });

    if (!order) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Order", "id"));
    }

    return order;
  }

  async updateStatus(
    id: string,
    storeId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    await this.ensureOrder(id, storeId);

    return this.prismaService.order.update({
      where: { id },
      data: updateOrderStatusDto,
      include: this.orderInclude(),
    });
  }
}

