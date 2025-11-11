import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: number;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  avatar?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  phone?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  googleId?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  facebookId?: string | null;

  @Exclude()
  password?: string | null;
}
