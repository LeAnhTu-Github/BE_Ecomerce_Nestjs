import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../service/prisma.service";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";
import { ColorDto } from "./dto/color.dto";
import { ENTITY_NOT_FOUND } from "../../lib/error-messages";

@Injectable()
export class ColorService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateColorDto) {
    return this.prismaService.color.create({ data });
  }

  findAll(storeId: string): Promise<ColorDto[]> {
    return this.prismaService.color.findMany({ where: { storeId } });
  }

  async findOne(id: string, storeId: string): Promise<ColorDto> {
    const color = await this.prismaService.color.findFirst({
      where: { id, storeId },
    });

    if (!color) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Color", "id"));
    }

    return color;
  }

  async update(id: string, storeId: string, data: UpdateColorDto) {
    await this.findOne(id, storeId);

    return this.prismaService.color.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, storeId: string) {
    await this.findOne(id, storeId);

    return this.prismaService.color.delete({ where: { id } });
  }
}
