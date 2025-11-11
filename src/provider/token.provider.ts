import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenProvider {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(payload: any): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: "30d" });

    return { accessToken, refreshToken };
  }

  signEmailToken(userId: number): string {
    return this.jwtService.sign({ userId }, { expiresIn: "30d" });
  }

  verifyEmailToken(token: string): { userId: number } {
    return this.jwtService.verify(token);
  }
}
