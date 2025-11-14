import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateColorDto {
  @ApiProperty({ type: String, description: "Color name", example: "Red" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: "Color value", example: "#ff0000" })
  @IsNotEmpty()
  @IsString({
    message: "Please provide a valid color value",
  })
  value: string;
}
