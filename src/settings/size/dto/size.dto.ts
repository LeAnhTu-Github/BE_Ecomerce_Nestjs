import { AbstractDto } from "../../../lib/abstract-dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SizeDto extends AbstractDto {
  @ApiProperty({ type: String, description: "Size name", example: "XL" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: "Size value", example: "extra-large" })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({ type: String, description: "Store ID", example: "c6f0..." })
  @IsNotEmpty()
  @IsString()
  storeId: string;
}
