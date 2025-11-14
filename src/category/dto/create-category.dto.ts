import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEqualTo } from "../../decorator/class-validation.decorator";

export class CreateCategoryDto {
  @ApiProperty({
    description: "Name of the category",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Parent category id",
    type: Number,
  })
  @IsNumber()
  @IsNotEqualTo("id")
  @IsOptional()
  parentId?: number;
}
