import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({
    example: "John Doe",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  fullName: string;

  @ApiProperty({
    example: "johndoe01@gmail.com",
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "Password123!",
  })
  @IsStrongPassword({
    minLength: 8,
  })
  password: string;
}
