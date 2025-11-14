import { UserDto } from "../user/dto/user.dto";

export interface SessionRequest extends Request {
  user: UserDto;
}
