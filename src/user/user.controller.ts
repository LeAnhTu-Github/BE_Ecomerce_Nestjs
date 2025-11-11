import { Controller, Get, HttpStatus } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserDto } from "./dto/user.dto";
import { UserResponseWrapper } from "../model/response.model";

@ApiTags("users")
@ApiBearerAuth("bearer-auth")
@ApiExtraModels(UserDto, UserResponseWrapper)
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("info")
  @ApiOperation({ summary: "Get current user information" })
  @ApiOkResponse({
    description: "User information successfully retrieved",
    type: UserResponseWrapper,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Unauthorized",
  })
  findCurrentUser(): Promise<UserDto> {
    return this.userService.findCurrentUser();
  }
}
