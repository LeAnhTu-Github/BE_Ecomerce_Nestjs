import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleGuard } from "../role/role.guard";
import { Role } from "@prisma/client";
import { Roles } from "../role/role.decorator";
import {
  CategoryResponse,
  CategoryResponseWrapper,
  CategoryListResponseWrapper,
} from "../model/response.model";

@ApiTags("categories")
@ApiBearerAuth("bearer-auth")
@ApiExtraModels(
  CategoryResponse,
  CategoryResponseWrapper,
  CategoryListResponseWrapper,
)
@Controller("categories")
@UseGuards(RoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles([Role.ADMIN])
  @Post()
  @ApiOperation({ summary: "Create a new category" })
  @ApiCreatedResponse({
    description: "Category successfully created",
    type: CategoryResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Validation error",
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
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Roles([Role.ADMIN])
  @Get()
  @ApiOperation({ summary: "Get all categories" })
  @ApiOkResponse({
    description: "Categories successfully retrieved",
    type: CategoryListResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Admin role required",
  })
  findAll(@Query("storeId", new ParseUUIDPipe()) storeId: string) {
    return this.categoryService.findAll(storeId);
  }

  @Roles([Role.ADMIN])
  @Get(":id")
  @ApiOperation({ summary: "Get a category by ID" })
  @ApiOkResponse({
    description: "Category successfully retrieved",
    type: CategoryResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Admin role required",
  })
  findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("storeId", new ParseUUIDPipe()) storeId: string,
  ) {
    return this.categoryService.findOne(id, storeId);
  }

  @Roles([Role.ADMIN])
  @Patch(":id")
  @ApiOperation({ summary: "Update a category" })
  @ApiOkResponse({
    description: "Category successfully updated",
    type: CategoryResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Admin role required",
  })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("storeId", new ParseUUIDPipe()) storeId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, storeId, updateCategoryDto);
  }

  @Roles([Role.ADMIN])
  @Delete(":id")
  @ApiOperation({ summary: "Delete a category" })
  @ApiOkResponse({
    description: "Category successfully deleted",
    type: CategoryResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Forbidden - Admin role required",
  })
  remove(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("storeId", new ParseUUIDPipe()) storeId: string,
  ) {
    return this.categoryService.remove(id, storeId);
  }
}
