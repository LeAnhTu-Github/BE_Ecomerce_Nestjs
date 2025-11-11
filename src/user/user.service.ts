import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../service/prisma.service";
import { UserDto } from "./dto/user.dto";
import { plainToInstance } from "class-transformer";
import { USER_NOT_FOUND } from "../lib/error-messages";
import { REQUEST } from "@nestjs/core";
import { SessionRequest } from "../model/request.model";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(REQUEST) private readonly request: SessionRequest,
  ) {}

  async findCurrentUser(): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: this.request.user.id,
      },
    });

    return plainToInstance(UserDto, user);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND("email"));
    }

    return plainToInstance(UserDto, user);
  }

  async confirmEmail(userId: number) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          isConfirmed: true,
          isActive: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
