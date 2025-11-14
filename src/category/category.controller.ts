import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
    description: "Parent category not found or validation error",
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
  findAll() {
    return this.categoryService.findAll();
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
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Roles([Role.ADMIN])
  @Get(":id/subcategories")
  @ApiOperation({ summary: "Get subcategories by parent category ID" })
  @ApiOkResponse({
    description: "Subcategories successfully retrieved",
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
  findSubcategoriesByParentId(@Param("id", ParseIntPipe) parentId: number) {
    return this.categoryService.findSubcategoriesByParentId(parentId);
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
    description: "Validation error or parent category cannot be itself",
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
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
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
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
