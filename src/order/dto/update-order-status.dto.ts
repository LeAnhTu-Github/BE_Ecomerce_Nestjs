import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateOrderStatusDto {
  @ApiProperty({ description: "Mark order as paid", type: Boolean })
  @IsBoolean()
  isPaid: boolean;
}

