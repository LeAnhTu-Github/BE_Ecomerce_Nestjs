import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsFile } from "../../decorator/class-validation.decorator";

export class CreateStoreDto {
  @ApiProperty({
    description: "Name of the store",
    minLength: 5,
    required: true,
    example: "My Store",
  })
  @IsNotEmpty()
  @MinLength(5)
  name: string;

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
