import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({
    type: String,
    description: "User email address",
    example: "abiyevhabil3@gmail.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: "User password",
    example: "Habil1410.",
    format: "password",
  })
  @IsStrongPassword({
    minLength: 8,
  })
  password: string;
}
