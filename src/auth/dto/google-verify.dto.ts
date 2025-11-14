import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GoogleVerifyDto {
  @ApiProperty({
    description: "Authorization code from Google OAuth callback",
    example: "4/0Ab32j91R3lTJHFaDWu2eRofp0gHB8UbXMS_AtGV-tpdiM7h3aAfbepCq6PYFvonfQAdssg",
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

