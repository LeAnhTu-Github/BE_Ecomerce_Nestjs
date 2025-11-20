import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateSizeDto {
  @ApiProperty({ type: String, description: "ID of the store", example: "c6f0..." })
  @IsUUID()
  storeId: string;

  @ApiProperty({ type: String, description: "Size name", example: "XL" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: "Size value", example: "extra-large" })
  @IsNotEmpty()
  @IsString()
  value: string;
}
