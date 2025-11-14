import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../service/prisma.service";
import { CreateSizeDto } from "./dto/create-size.dto";
import { SizeDto } from "./dto/size.dto";
import { UpdateSizeDto } from "./dto/update-size.dto";

@Injectable()
export class SizeService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateSizeDto) {
    return this.prismaService.size.create({ data });
  }

  findAll(): Promise<SizeDto[]> {
    return this.prismaService.size.findMany();
  }

  findOne(id: number): Promise<SizeDto | null> {
    return this.prismaService.size.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateSizeDto) {
    return this.prismaService.size.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prismaService.size.delete({ where: { id } });
  }
}
