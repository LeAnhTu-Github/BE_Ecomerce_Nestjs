import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../service/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ENTITY_NOT_FOUND } from "../lib/error-messages";

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  private async ensureStore(storeId: string) {
    const store = await this.prismaService.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Store", "id"));
    }
  }

  private async ensureCategory(storeId: string, categoryId: string) {
    const category = await this.prismaService.category.findFirst({
      where: { id: categoryId, storeId },
    });

    if (!category) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Category", "id"));
    }
  }

  private async ensureSize(storeId: string, sizeId: string) {
    const size = await this.prismaService.size.findFirst({
      where: { id: sizeId, storeId },
    });

    if (!size) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Size", "id"));
    }
  }

  private async ensureColor(storeId: string, colorId: string) {
    const color = await this.prismaService.color.findFirst({
      where: { id: colorId, storeId },
    });

    if (!color) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Color", "id"));
    }
  }

  private productInclude() {
    return {
      images: true,
      category: true,
      size: true,
      color: true,
    };
  }

  async create(createProductDto: CreateProductDto) {
    const { storeId, categoryId, sizeId, colorId, images, ...rest } =
      createProductDto;

    await Promise.all([
      this.ensureStore(storeId),
      this.ensureCategory(storeId, categoryId),
      this.ensureSize(storeId, sizeId),
      this.ensureColor(storeId, colorId),
    ]);

    return this.prismaService.product.create({
      data: {
        ...rest,
        storeId,
        categoryId,
        sizeId,
        colorId,
        images: {
          create: (images || []).map((url) => ({ url })),
        },
      },
      include: this.productInclude(),
    });
  }

  findAll(storeId: string) {
    return this.prismaService.product.findMany({
      where: { storeId },
      include: this.productInclude(),
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, storeId: string) {
    const product = await this.prismaService.product.findFirst({
      where: { id, storeId },
      include: this.productInclude(),
    });

    if (!product) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Product", "id"));
    }

    return product;
  }

  async update(
    id: string,
    storeId: string,
    updateProductDto: UpdateProductDto,
  ) {
    const existing = await this.findOne(id, storeId);
    const { images, categoryId, sizeId, colorId, ...rest } = updateProductDto;

    await Promise.all([
      categoryId
        ? this.ensureCategory(storeId, categoryId)
        : Promise.resolve(),
      sizeId ? this.ensureSize(storeId, sizeId) : Promise.resolve(),
      colorId ? this.ensureColor(storeId, colorId) : Promise.resolve(),
    ]);

    return this.prismaService.$transaction(async (tx) => {
      if (images) {
        await tx.image.deleteMany({ where: { productId: id } });
      }

      return tx.product.update({
        where: { id: existing.id },
        data: {
          ...rest,
          ...(categoryId && { categoryId }),
          ...(sizeId && { sizeId }),
          ...(colorId && { colorId }),
          ...(images && {
            images: {
              create: images.map((url) => ({ url })),
            },
          }),
        },
        include: this.productInclude(),
      });
    });
  }

  async remove(id: string, storeId: string) {
    await this.findOne(id, storeId);

    return this.prismaService.product.delete({
      where: { id },
      include: this.productInclude(),
    });
  }
}
