import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty({
    description: "Store identifier",
    type: String,
    example: "c6f0d331-43c6-4dfb-b0ad-9745cb06d8f7",
  })
  @IsUUID()
  storeId: string;

  @ApiProperty({
    description: "Billboard identifier",
    type: String,
    example: "de5f7e21-a1d3-4e0d-a7b7-86ef0f6fdc83",
  })
  @IsUUID()
  billboardId: string;

  @ApiProperty({
    description: "Name of the category",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
