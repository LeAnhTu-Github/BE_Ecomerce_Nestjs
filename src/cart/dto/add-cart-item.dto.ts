import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsUUID, Min } from "class-validator";

export class AddCartItemDto {
  @ApiProperty({ description: "Store identifier", type: String })
  @IsUUID()
  storeId: string;

  @ApiProperty({ description: "Product identifier", type: String })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: "Quantity to add", type: Number, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

