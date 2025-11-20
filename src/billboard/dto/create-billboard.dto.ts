import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateBillboardDto {
  @ApiProperty({ description: "Store identifier", type: String })
  @IsUUID()
  storeId: string;

  @ApiProperty({ description: "Billboard label", example: "Summer Sale" })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    description: "Public URL for the billboard image",
    example: "https://cdn.example.com/banners/summer.jpg",
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}

