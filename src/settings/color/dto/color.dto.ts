import { IsNotEmpty, IsString } from "class-validator";
import { AbstractDto } from "../../../lib/abstract-dto";

export class ColorDto extends AbstractDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString({
    message: "Please provide a valid color value",
  })
  value: string;
}
