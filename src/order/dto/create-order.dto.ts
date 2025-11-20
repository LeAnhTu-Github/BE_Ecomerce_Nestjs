import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class CreateOrderDto {
  @ApiProperty({ description: "Store identifier", type: String })
  @IsUUID()
  storeId: string;

  @ApiProperty({ description: "Cart identifier", type: String })
  @IsUUID()
  cartId: string;

  @ApiProperty({ description: "Order contact phone", example: "+1 555-5555" })
  @IsString()
  @MinLength(5)
  phone: string;

  @ApiProperty({
    description: "Delivery address",
    example: "123 Commerce Street, Springfield",
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}

