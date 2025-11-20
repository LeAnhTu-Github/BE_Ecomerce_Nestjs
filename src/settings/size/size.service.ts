import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../service/prisma.service";
import { CreateSizeDto } from "./dto/create-size.dto";
import { SizeDto } from "./dto/size.dto";
import { UpdateSizeDto } from "./dto/update-size.dto";
import { ENTITY_NOT_FOUND } from "../../lib/error-messages";

@Injectable()
export class SizeService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateSizeDto) {
    return this.prismaService.size.create({ data });
  }

  findAll(storeId: string): Promise<SizeDto[]> {
    return this.prismaService.size.findMany({ where: { storeId } });
  }

  async findOne(id: string, storeId: string): Promise<SizeDto> {
    const size = await this.prismaService.size.findFirst({
      where: { id, storeId },
    });

    if (!size) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Size", "id"));
    }

    return size;
  }

  async update(id: string, storeId: string, data: UpdateSizeDto) {
    await this.findOne(id, storeId);

    return this.prismaService.size.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, storeId: string) {
    await this.findOne(id, storeId);

    return this.prismaService.size.delete({ where: { id } });
  }
}
