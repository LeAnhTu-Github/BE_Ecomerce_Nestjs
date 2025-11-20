import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../service/prisma.service";
import { CreateBillboardDto } from "./dto/create-billboard.dto";
import { UpdateBillboardDto } from "./dto/update-billboard.dto";
import { ENTITY_NOT_FOUND } from "../lib/error-messages";

@Injectable()
export class BillboardService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createBillboardDto: CreateBillboardDto) {
    return this.prismaService.billboard.create({
      data: createBillboardDto,
    });
  }

  findAll(storeId: string) {
    return this.prismaService.billboard.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, storeId: string) {
    const billboard = await this.prismaService.billboard.findFirst({
      where: { id, storeId },
    });

    if (!billboard) {
      throw new NotFoundException(ENTITY_NOT_FOUND("Billboard", "id"));
    }

    return billboard;
  }

  async update(
    id: string,
    storeId: string,
    updateBillboardDto: UpdateBillboardDto,
  ) {
    await this.findOne(id, storeId);

    return this.prismaService.billboard.update({
      where: { id },
      data: updateBillboardDto,
    });
  }

  async remove(id: string, storeId: string) {
    await this.findOne(id, storeId);

    return this.prismaService.billboard.delete({
      where: { id },
    });
  }
}

