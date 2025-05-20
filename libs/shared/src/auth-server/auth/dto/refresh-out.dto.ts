import { BaseOutDto } from '@libs/core/dto/base-out.dto';

export class RefreshOutDto extends BaseOutDto {
  refreshToken: string;
  token: string;
  tokenExpires: number;
}
