import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../service/prisma.service";
import { ENTITY_NOT_FOUND } from "../lib/error-messages";

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  private async validateStore(storeId: string) {
    const store = await this.prismaService.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new BadRequestException(ENTITY_NOT_FOUND("Store", "id"));
    }
  }

  private async validateBillboard(storeId: string, billboardId: string) {
    const billboard = await this.prismaService.billboard.findFirst({
      where: { id: billboardId, storeId },
    });

    if (!billboard) {
      throw new BadRequestException(ENTITY_NOT_FOUND("Billboard", "id"));
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { storeId, billboardId, name } = createCategoryDto;

    await this.validateStore(storeId);
    await this.validateBillboard(storeId, billboardId);

    return this.prismaService.category.create({
      data: { storeId, billboardId, name },
    });
  }

  findAll(storeId: string) {
    return this.prismaService.category.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, storeId: string) {
    const category = await this.prismaService.category.findFirst({
      where: { id, storeId },
    });

    if (!category) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Category", "id"));
    }

    return category;
  }

  async update(id: string, storeId: string, dto: UpdateCategoryDto) {
    await this.findOne(id, storeId);

    if (dto.billboardId) {
      await this.validateBillboard(storeId, dto.billboardId);
    }

    return this.prismaService.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, storeId: string) {
    await this.findOne(id, storeId);

    return this.prismaService.category.delete({
      where: { id },
    });
  }
}
