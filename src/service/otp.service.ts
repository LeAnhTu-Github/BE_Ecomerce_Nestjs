import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfirmationOtp as EmailConfirmationOtpModel } from "@prisma/client";
import * as crypto from "crypto";
import { PrismaService } from "./prisma.service";
import { OTP_EXPIRED } from "../lib/error-messages";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class OtpService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async createEmailConfirmationOtp(userId: number) {
    const otpCode = crypto.randomInt(100000, 999999);

    return this.prismaService.confirmationOtp.create({
      data: {
        userId,
        otpCode,
        expiryDate: new Date(Date.now() + 5 * 60 * 1000), // after 5 minutes
      },
    });
  }

  async getEmailConfirmationOtp(userId: number) {
    return this.prismaService.confirmationOtp.findUnique({
      where: {
        userId,
      },
    });
  }

  async verifyEmailConfirmationOtp(
    otpCode: number,
    emailConfirmationOtp: EmailConfirmationOtpModel,
  ) {
    if (emailConfirmationOtp.expiryDate < new Date()) {
      throw new BadRequestException(OTP_EXPIRED);
    }

    return otpCode === emailConfirmationOtp.otpCode;
  }

  async deleteEmailConfirmationOtp(userId: number) {
    try {
      await this.prismaService.confirmationOtp.delete({
        where: {
          userId,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Cron("0 */30 * * * *") // every 30 minutes
  handleEmailConfirmationOtpCron() {
    this.prismaService.confirmationOtp
      .deleteMany({
        where: {
          expiryDate: {
            lte: new Date(),
          },
        },
      })
      .then((res) => {
        this.logger.log(
          new Date() +
            ": Deleted expired email confirmation OTPs: " +
            res.count,
        );
      })
      .catch((e) => {
        this.logger.error(
          new Date() +
            ": Error while deleting expired email confirmation OTPs: " +
            e.message,
        );
      });
  }
}
