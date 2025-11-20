import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateProductDto {
  @ApiProperty({ description: "Store identifier", type: String })
  @IsUUID()
  storeId: string;

  @ApiProperty({ description: "Category identifier", type: String })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ description: "Size identifier", type: String })
  @IsUUID()
  sizeId: string;

  @ApiProperty({ description: "Color identifier", type: String })
  @IsUUID()
  colorId: string;

  @ApiProperty({
    description: "Product name",
    example: "iPhone 15 Pro",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Product description",
    minLength: 15,
    maxLength: 500,
    example: "This is a detailed product description",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(15)
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: "Product price",
    example: 999.99,
    type: Number,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @ApiProperty({
    description: "Mark as featured product",
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    description: "Mark as archived product",
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiProperty({
    description: "List of image URLs",
    type: [String],
    example: ["https://example.com/image-1.jpg"],
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  images: string[];
}
