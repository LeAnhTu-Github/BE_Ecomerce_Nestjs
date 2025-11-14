import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
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
    maxLength: 300,
    example: "This is a detailed product description",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(15)
  @MaxLength(300)
  description: string;

  @ApiProperty({
    description: "Product price",
    example: 999.99,
    type: Number,
    minimum: 0,
  })
  @IsDecimal({
    decimal_digits: "8,2",
  })
  @Min(0)
  price: number;

  @ApiProperty({
    description: "Product discount",
    example: 50.00,
    type: Number,
    minimum: 0,
    required: false,
  })
  @IsDecimal({
    decimal_digits: "8,2",
  })
  @Min(0)
  @IsOptional()
  discount?: number;
}
