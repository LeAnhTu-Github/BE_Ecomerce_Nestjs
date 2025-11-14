import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ColorService } from "./color.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleGuard } from "../../role/role.guard";
import { CreateColorDto } from "./dto/create-color.dto";
import { UpdateColorDto } from "./dto/update-color.dto";
import { Roles } from "../../role/role.decorator";
import { Role } from "@prisma/client";
import {
  ColorResponse,
  ColorResponseWrapper,
  ColorListResponseWrapper,
} from "../../model/response.model";

@ApiTags("colors")
@UseGuards(RoleGuard)
@ApiBearerAuth("bearer-auth")
@ApiExtraModels(
  ColorResponse,
  ColorResponseWrapper,
  ColorListResponseWrapper,
)
@Controller("settings/colors")
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Roles([Role.ADMIN])
  @Post()
  @ApiOperation({ summary: "Create a new color" })
  @ApiCreatedResponse({
    description: "Color successfully created",
    type: ColorResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Admin role required",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  create(@Body() data: CreateColorDto) {
    return this.colorService.create(data);
  }

  @Roles([Role.ADMIN])
  @Get()
  @ApiOperation({ summary: "Get all colors" })
  @ApiOkResponse({
    description: "Colors successfully retrieved",
    type: ColorListResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Admin role required",
  })
  findAll() {
    return this.colorService.findAll();
  }

  @Roles([Role.ADMIN])
  @Get(":id")
  @ApiOperation({ summary: "Get a color by ID" })
  @ApiOkResponse({
    description: "Color successfully retrieved",
    type: ColorResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Color not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Admin role required",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.colorService.findOne(id);
  }

  @Roles([Role.ADMIN])
  @Put(":id")
  @ApiOperation({ summary: "Update a color" })
  @ApiOkResponse({
    description: "Color successfully updated",
    type: ColorResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Color not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Admin role required",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateColorDto) {
    return this.colorService.update(id, data);
  }

  @Roles([Role.ADMIN])
  @Delete(":id")
  @ApiOperation({ summary: "Delete a color" })
  @ApiOkResponse({
    description: "Color successfully deleted",
    type: ColorResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Color not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Admin role required",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.colorService.remove(id);
  }
}
