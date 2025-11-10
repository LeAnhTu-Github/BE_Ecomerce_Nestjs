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
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  ProductResponse,
  ProductResponseWrapper,
  ProductListResponseWrapper,
} from "../model/response.model";

@ApiTags("products")
@ApiExtraModels(
  ProductResponse,
  ProductResponseWrapper,
  ProductListResponseWrapper,
)
@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  @ApiCreatedResponse({
    description: "Product successfully created",
    type: ProductResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiOkResponse({
    description: "Products successfully retrieved",
    type: ProductListResponseWrapper,
  })
  findAll() {
    return this.productService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a product by ID" })
  @ApiOkResponse({
    description: "Product successfully retrieved",
    type: ProductResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a product" })
  @ApiOkResponse({
    description: "Product successfully updated",
    type: ProductResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a product" })
  @ApiOkResponse({
    description: "Product successfully deleted",
    type: ProductResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
