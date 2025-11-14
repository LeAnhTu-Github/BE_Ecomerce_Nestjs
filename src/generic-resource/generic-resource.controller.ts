import {
  Body,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { GenericResourceService } from "./generic-resource.service";

export class GenericResourceController<TCreateDto, TUpdateDto, TDto> {
  constructor(
    private readonly service: GenericResourceService<
      TCreateDto,
      TUpdateDto,
      TDto
    >,
  ) {}

  @Post()
  create(@Body() data: TCreateDto) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() data: TUpdateDto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
