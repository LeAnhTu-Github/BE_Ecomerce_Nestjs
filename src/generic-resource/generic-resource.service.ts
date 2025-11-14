// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { PrismaService } from "../service/prisma.service";

export abstract class GenericResourceService<TCreateDto, TUpdateDto, TDto> {
  protected constructor(private readonly prisma: PrismaService) {}

  create(data: TCreateDto) {
    return this.prisma[this.getEntityName()].create({ data });
  }

  findAll(): Promise<TDto[]> {
    return this.prisma[this.getEntityName()].findMany();
  }

  findOne(id: number): Promise<TDto | null> {
    return this.prisma[this.getEntityName()].findUnique({ where: { id } });
  }

  update(id: number, data: TUpdateDto) {
    return this.prisma[this.getEntityName()].update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma[this.getEntityName()].delete({ where: { id } });
  }

  protected abstract getEntityName(): any;
}
