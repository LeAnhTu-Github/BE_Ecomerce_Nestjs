import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsFile } from "../../decorator/class-validation.decorator";
import { UniqueFieldValidator } from "../../validation/unique-field.validator";

export class CreateStoreDto {
  @ApiProperty({
    description: "Name of the store",
    minLength: 5,
    required: true,
    example: "My Store",
  })
  @IsNotEmpty()
  @MinLength(5)
  @Validate(UniqueFieldValidator, ["name", "store"])
  name: string;

  @ApiProperty({
    description: "Country id of the store",
    required: true,
    example: 1,
  })
  @IsString()
  countryId: number;

  @ApiProperty({
    description: "City id of the store",
    required: true,
    example: 1,
  })
  @IsString()
  cityId: number;

  @ApiProperty({
    description: "Address of the store",
    minLength: 10,
    maxLength: 300,
    required: true,
    example: "My Store Address",
  })
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(300)
  address: string;

  @ApiProperty({ type: "string", format: "binary", required: true })
  @IsOptional()
  @IsFile("Logo")
  logo: string;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  @IsFile("Banner")
  banner?: string;
}
