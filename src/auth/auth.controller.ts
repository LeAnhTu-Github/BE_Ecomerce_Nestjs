import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Initiate Google OAuth login" })
  @ApiOkResponse({
    description: "Redirects to Google OAuth",
  })
  async googleAuth() {
    // Guard redirects to Google
  }

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "Google OAuth callback" })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: "Redirects to frontend with accessToken and refreshToken in query parameters",
  })
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const redirectUrl = `${frontendUrl}/auth/google?accessToken=${encodeURIComponent(result.accessToken)}&refreshToken=${encodeURIComponent(result.refreshToken)}`;
    return res.redirect(redirectUrl);
  }
}
