import { BaseOutDto } from '@libs/core/dto/base-out.dto';

import { UserDto } from '../../users/dto/user.dto';

export class LoginOutDto extends BaseOutDto {
  refreshToken: string;
  token: string;
  tokenExpires: number;
  user: UserDto;
}
