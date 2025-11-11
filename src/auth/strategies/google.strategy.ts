import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const firstName = name?.givenName || "";
    const lastName = name?.familyName || "";
    const fullName = `${firstName} ${lastName}`.trim() || name?.displayName || emails[0]?.value?.split("@")[0] || "User";
    
    const user = {
      googleId: id,
      email: emails[0]?.value,
      fullName,
      avatar: photos?.[0]?.value,
      accessToken,
    };
    done(null, user);
  }
}

