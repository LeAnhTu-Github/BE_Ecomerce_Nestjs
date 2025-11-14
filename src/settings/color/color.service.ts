import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../service/prisma.service";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";
import { ColorDto } from "./dto/color.dto";

@Injectable()
export class ColorService {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateColorDto) {
    return this.prismaService.color.create({ data });
  }

  findAll(): Promise<ColorDto[]> {
    return this.prismaService.color.findMany();
  }

  findOne(id: number): Promise<ColorDto | null> {
    return this.prismaService.color.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateColorDto) {
    return this.prismaService.color.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prismaService.color.delete({ where: { id } });
  }
}
