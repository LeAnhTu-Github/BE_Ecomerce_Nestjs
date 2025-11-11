import { Logger, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { PrismaService } from "../service/prisma.service";
import { UserService } from "../user/user.service";
import { TokenProvider } from "../provider/token.provider";
import { MailService } from "../service/mail.service";
import { OtpService } from "../service/otp.service";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    UserService,
    TokenProvider,
    MailService,
    OtpService,
    GoogleStrategy,
    Logger,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
