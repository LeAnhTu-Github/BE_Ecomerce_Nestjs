import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import * as process from "process";
import * as path from "path";
import * as fs from "fs";
import { UserDto } from "../user/dto/user.dto";

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly confirmationTemplate: handlebars.TemplateDelegate;
  private readonly passwordResetTemplate: handlebars.TemplateDelegate;

  constructor() {
    this.transporter = nodemailer.createTransport(
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore FIXME: fix this
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: process.env.MAILER_SECURE,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
        service: "gmail",
      },
      {
        from: {
          name: "No-reply",
          address: process.env.MAIL_FROM,
        },
      },
    );

    this.confirmationTemplate = this.loadTemplate("confirmation.hbs");
  }

  private loadTemplate(templateName: string): handlebars.TemplateDelegate {
    const templatesFolderPath = path.join(__dirname, "../../templates"); // FIXME: path is not correct should be in src
    const templatePath = path.join(templatesFolderPath, templateName);

    const templateSource = fs.readFileSync(templatePath, "utf8");
    return handlebars.compile(templateSource);
  }

  async sendUserConfirmation(user: UserDto, token: string, otp: number) {
    const url = `${process.env.CLIENT_URL}/auth/confirm-email?token=${token}`;
    // Extract first name from fullName for greeting
    const firstName = user.fullName || "User";
    const html = this.confirmationTemplate({
      name: firstName,
      url,
      otp,
    });

    await this.transporter.sendMail({
      to: user.email,
      subject: `Welcome ${firstName}! Confirm your email and start using the app!`,
      html,
    });
  }
}
