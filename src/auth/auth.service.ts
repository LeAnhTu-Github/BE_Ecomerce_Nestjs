import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../service/prisma.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import * as bcrypt from "bcrypt";
import { UserDto } from "../user/dto/user.dto";
import { plainToInstance } from "class-transformer";
import { UserService } from "../user/user.service";
import {
  EMAIL_CONFIRMED,
  INVALID_AUTH_CREDENTIALS,
  INVALID_OTP,
  INVALID_REFRESH_TOKEN,
  INVALID_TOKEN,
  OTP_NOT_FOUND,
  USER_ALREADY_EXISTS,
  USER_NOT_ACTIVE,
  USER_NOT_CONFIRMED_EMAIL,
  USER_NOT_FOUND,
} from "../lib/error-messages";
import { TokenProvider } from "../provider/token.provider";
import {
  ConfirmEmailResponse,
  SignInResponse,
  SignUpResponse,
  TokenResponse,
} from "../model/response.model";
import { MailService } from "../service/mail.service";
import { OtpService } from "../service/otp.service";
import { EmailConfirmationDto } from "./dto/email-confirmation.dto";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenProvider: TokenProvider,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    const { email, password } = signInDto;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException(INVALID_AUTH_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new BadRequestException(USER_NOT_ACTIVE);
    }

    if (!user.isConfirmed) {
      throw new BadRequestException(USER_NOT_CONFIRMED_EMAIL);
    }

    // Check if user has password (not Google-only user)
    if (!user.password) {
      throw new BadRequestException(INVALID_AUTH_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException(INVALID_AUTH_CREDENTIALS);
    }

    const { accessToken, refreshToken } =
      this.tokenProvider.generateTokens(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    const { fullName, email, password } = signUpDto;

    const passwordHash = await this.generatePasswordHash(password);

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }

    try {
      const user = await this.prismaService.user.create({
        data: {
          fullName,
          email,
          password: passwordHash,
        },
      });

      const emailToken = this.tokenProvider.signEmailToken(user.id);

      const { otpCode } = await this.otpService.createEmailConfirmationOtp(
        user.id,
      );

      await this.mailService.sendUserConfirmation(user, emailToken, otpCode);

      return plainToInstance(UserDto, user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async confirmEmail(
    emailConfirmationDto: EmailConfirmationDto,
  ): Promise<ConfirmEmailResponse> {
    const { emailToken, otpCode } = emailConfirmationDto;
    const { userId } = this.tokenProvider.verifyEmailToken(emailToken);

    if (!userId) {
      throw new BadRequestException(INVALID_TOKEN);
    }

    const emailConfirmationOtp =
      await this.otpService.getEmailConfirmationOtp(userId);

    if (!emailConfirmationOtp) {
      throw new BadRequestException(OTP_NOT_FOUND);
    }

    const emailIsConfirmed = await this.otpService.verifyEmailConfirmationOtp(
      otpCode,
      emailConfirmationOtp,
    );

    if (!emailIsConfirmed) {
      throw new BadRequestException(INVALID_OTP);
    }

    await this.userService.confirmEmail(userId);
    await this.otpService.deleteEmailConfirmationOtp(userId);

    return {
      success: true,
      message: EMAIL_CONFIRMED,
    };
  }

  async refresh(refreshToken: string) {
    const { id: userId } = this.jwtService.verify(refreshToken);

    if (!userId) {
      return new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      const tokens = this.tokenProvider.generateTokens(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (e) {
      throw new NotFoundException(USER_NOT_FOUND("token"));
    }
  }

  async generatePasswordHash(password: string): Promise<string> {
    try {
      const passwordSalt = await bcrypt.genSalt();
      return await bcrypt.hash(password, passwordSalt);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async googleLogin(user: any): Promise<TokenResponse> {
    const { googleId, email, fullName, avatar } = user;

    // Check if user exists by googleId
    let existingUser = await this.prismaService.user.findUnique({
      where: {
        googleId,
      },
    });

    // If not found by googleId, check by email
    if (!existingUser) {
      existingUser = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      // If user exists by email but doesn't have googleId, link the account
      if (existingUser && !existingUser.googleId) {
        existingUser = await this.prismaService.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            googleId,
            avatar: avatar || existingUser.avatar,
            // Auto-confirm email for Google users
            isConfirmed: true,
            isActive: true,
          },
        });
      }
    }

    // Create new user if doesn't exist
    if (!existingUser) {
      existingUser = await this.prismaService.user.create({
        data: {
          googleId,
          email,
          fullName,
          avatar,
          // Auto-confirm email for Google users
          isConfirmed: true,
          isActive: true,
        },
      });
    }

    const { accessToken, refreshToken } =
      this.tokenProvider.generateTokens(existingUser);

    return {
      accessToken,
      refreshToken,
    };
  }

  async googleVerifyCode(code: string): Promise<SignInResponse> {
    try {
      // Exchange code with Google OAuth API to get access token
      const params = new URLSearchParams();
      params.append("code", code);
      params.append("client_id", process.env.GOOGLE_CLIENT_ID || "");
      params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET || "");
      // Cập nhật: redirect_uri phải khớp với callback URL trong Google Console (FE URL)
      params.append("redirect_uri", process.env.GOOGLE_CALLBACK_URL || "");
      params.append("grant_type", "authorization_code");

      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const { access_token, id_token } = tokenResponse.data;

      if (!access_token) {
        throw new BadRequestException("Failed to exchange code for access token");
      }

      // Get user profile from Google API
      const profileResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const profile = profileResponse.data;

      // Validate profile data
      if (!profile || !profile.id || !profile.email) {
        throw new BadRequestException("Invalid user profile from Google");
      }

      // Extract user data from profile
      const { id: googleId, email, given_name, family_name, name, picture } =
        profile;
      const firstName = given_name || "";
      const lastName = family_name || "";
      const fullName =
        `${firstName} ${lastName}`.trim() ||
        name ||
        email?.split("@")[0] ||
        "User";

      // Create user object for googleLogin method
      const user = {
        googleId,
        email,
        fullName,
        avatar: picture,
        accessToken: access_token,
      };

      // Use existing googleLogin method to handle user creation/login
      return await this.googleLogin(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error_description ||
          error.response?.data?.error ||
          "Failed to verify Google OAuth code";
        throw new BadRequestException(errorMessage);
      }

      throw new InternalServerErrorException(
        error?.message || "Failed to verify Google OAuth code",
      );
    }
  }
}
