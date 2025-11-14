import { IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EmailConfirmationDto {
  @ApiProperty({
    example: "e2^3@#e2^3@#e2^3@#e2^3@#e2^3@#",
  })
  @IsNotEmpty()
  emailToken: string;

  @ApiProperty({
    example: "327123",
  })
  @IsNumber()
  otpCode: number;
}
