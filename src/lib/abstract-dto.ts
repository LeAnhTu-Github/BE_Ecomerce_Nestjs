import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber } from "class-validator";

export class AbstractDto {
  @ApiProperty({ type: Number, description: "Unique identifier" })
  @IsNumber()
  id: number;

  @ApiProperty({ type: Date, description: "Date of creation" })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: Date, description: "Date of last update" })
  @IsDate()
  updatedAt: Date;
}
