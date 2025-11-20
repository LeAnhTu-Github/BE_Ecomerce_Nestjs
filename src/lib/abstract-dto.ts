import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";

export class AbstractDto {
  @ApiProperty({ type: String, description: "Unique identifier" })
  @IsString()
  id: string;

  @ApiProperty({ type: Date, description: "Date of creation" })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: Date, description: "Date of last update" })
  @IsDate()
  updatedAt: Date;
}
