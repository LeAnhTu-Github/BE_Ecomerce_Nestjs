import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { SignInDto } from "./dto/sign-in.dto";
import { AuthService } from "./auth.service";
import { Public } from "../decorator/public-route.decorator";
import { SignUpDto } from "./dto/sign-up.dto";
import {
  ConfirmEmailResponse,
  ConfirmEmailResponseWrapper,
  RefreshTokenResponse,
  RefreshTokenResponseWrapper,
  SignInResponse,
  SignInResponseWrapper,
  SignUpResponse,
  SignUpResponseWrapper,
} from "../model/response.model";
import { EmailConfirmationDto } from "./dto/email-confirmation.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { GoogleVerifyDto } from "./dto/google-verify.dto";
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

@ApiTags("auth")
@ApiExtraModels(
  SignInResponse,
  SignInResponseWrapper,
  SignUpResponse,
  SignUpResponseWrapper,
  ConfirmEmailResponse,
  ConfirmEmailResponseWrapper,
  RefreshTokenResponse,
  RefreshTokenResponseWrapper,
)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign in user" })
  @ApiOkResponse({
    description: "User successfully signed in. Returns accessToken and refreshToken. Use /users/me endpoint to get user information.",
    type: SignInResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Public()
  @Post("sign-up")
  @ApiOperation({ summary: "Sign up new user" })
  @ApiCreatedResponse({
    description: "User successfully registered",
    type: SignUpResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @Public()
  @Post("confirm-email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Confirm user email" })
  @ApiOkResponse({
    description: "Email successfully confirmed",
    type: ConfirmEmailResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid or expired OTP",
  })
  async confirmEmail(@Body() emailConfirmationDto: EmailConfirmationDto) {
    return await this.authService.confirmEmail(emailConfirmationDto);
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiOkResponse({
    description: "Token successfully refreshed",
    type: RefreshTokenResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid or expired refresh token",
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @Public()
  @Get("google")
  @ApiOperation({ summary: "Initiate Google OAuth login" })
  @ApiOkResponse({
    description: "Redirects to Google OAuth",
  })
  async googleAuth(@Res() res: Response) {
    const clientId = process.env.GOOGLE_CLIENT_ID || "";
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5173/auth/google/callback";
    const scope = "openid email profile";
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=online`;
    
    return res.redirect(googleAuthUrl);
  }

  @Public()
  @Post("google/verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify Google OAuth code and exchange for tokens" })
  @ApiOkResponse({
    description: "Successfully verified code and returns accessToken and refreshToken",
    type: SignInResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: "Validation error",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid or expired authorization code",
  })
  async googleVerify(@Body() googleVerifyDto: GoogleVerifyDto) {
    return await this.authService.googleVerifyCode(googleVerifyDto.code);
  }
}
