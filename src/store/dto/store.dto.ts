import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { IsFile } from "../../decorator/class-validation.decorator";
import { AbstractDto } from "../../lib/abstract-dto";

export class StoreDto extends AbstractDto {
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  countryId: number;

  @IsString()
  cityId: number;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(300)
  address: string;

  @IsOptional()
  @IsFile("Logo")
  logo: string;

  @IsOptional()
  @IsFile("Banner")
  banner?: string;
}
