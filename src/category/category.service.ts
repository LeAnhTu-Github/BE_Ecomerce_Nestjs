import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../service/prisma.service";
import {
  ENTITY_NOT_FOUND,
  PARENT_CATEGORY_CANNOT_BE_ITSELF,
} from "../lib/error-messages";

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, parentId } = createCategoryDto;

    if (parentId) {
      const parentCategory = await this.prismaService.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new BadRequestException(ENTITY_NOT_FOUND("Category", "parentId"));
      }
    }

    return this.prismaService.category.create({
      data: {
        name,
        parentId: parentId || null,
      },
    });
  }

  findAll() {
    return this.prismaService.category.findMany();
  }

  findOne(id: number) {
    return this.prismaService.category.findUnique({
      where: { id },
    });
  }

  findSubcategoriesByParentId(parentId: number) {
    return this.prismaService.category.findMany({
      where: { parentId },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name, parentId } = updateCategoryDto;

    if (parentId !== undefined && id === parentId) {
      throw new UnprocessableEntityException(PARENT_CATEGORY_CANNOT_BE_ITSELF);
    }

    return this.prismaService.category.update({
      where: { id },
      data: {
        name,
        parentId,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.category.delete({
      where: { id },
    });
  }
}
