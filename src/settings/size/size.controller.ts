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
import { Roles } from "../../role/role.decorator";
import { Role } from "@prisma/client";
import { CreateSizeDto } from "./dto/create-size.dto";
import { UpdateSizeDto } from "./dto/update-size.dto";
import { SizeService } from "./size.service";
import {
  SizeResponse,
  SizeResponseWrapper,
  SizeListResponseWrapper,
} from "../../model/response.model";

@ApiTags("sizes")
@UseGuards(RoleGuard)
@ApiBearerAuth("bearer-auth")
@ApiExtraModels(
  SizeResponse,
  SizeResponseWrapper,
  SizeListResponseWrapper,
)
@Controller("settings/sizes")
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Roles([Role.ADMIN])
  @Post()
  @ApiOperation({ summary: "Create a new size" })
  @ApiCreatedResponse({
    description: "Size successfully created",
    type: SizeResponseWrapper,
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
  create(@Body() data: CreateSizeDto) {
    return this.sizeService.create(data);
  }

  @Roles([Role.ADMIN])
  @Get()
  @ApiOperation({ summary: "Get all sizes" })
  @ApiOkResponse({
    description: "Sizes successfully retrieved",
    type: SizeListResponseWrapper,
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
    return this.sizeService.findAll();
  }

  @Roles([Role.ADMIN])
  @Get(":id")
  @ApiOperation({ summary: "Get a size by ID" })
  @ApiOkResponse({
    description: "Size successfully retrieved",
    type: SizeResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Size not found",
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
    return this.sizeService.findOne(id);
  }

  @Roles([Role.ADMIN])
  @Put(":id")
  @ApiOperation({ summary: "Update a size" })
  @ApiOkResponse({
    description: "Size successfully updated",
    type: SizeResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Size not found",
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
  update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateSizeDto) {
    return this.sizeService.update(id, data);
  }

  @Roles([Role.ADMIN])
  @Delete(":id")
  @ApiOperation({ summary: "Delete a size" })
  @ApiOkResponse({
    description: "Size successfully deleted",
    type: SizeResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Size not found",
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
    return this.sizeService.remove(id);
  }
}
