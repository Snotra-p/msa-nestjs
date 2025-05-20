import { Body, Controller, HttpStatus, Request, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { ResponseEntity } from '@libs/core/dto/response-entity';

import { AuthService } from './auth.service';
import { LoginInDto } from '../../../../libs/shared/src/auth-server/auth/dto/login-in.dto';
import { LoginOutDto } from '../../../../libs/shared/src/auth-server/auth/dto/login-out.dto';
import { AUTH_SERVER_ERROR_KEY } from '../error/auth-server-error';
import { RefreshOutDto } from '../../../../libs/shared/src/auth-server/auth/dto/refresh-out.dto';
import { RefreshInDto } from '../../../../libs/shared/src/auth-server/auth/dto/refresh-in.dto';
import { LogoutInDto } from '../../../../libs/shared/src/auth-server/auth/dto/logout-in.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiResponseDocs({
    type: LoginOutDto,
    errors: [
      AUTH_SERVER_ERROR_KEY.USER_NOT_FOUND,
      AUTH_SERVER_ERROR_KEY.AUTH_PASSWORD_INCORRECT,
    ],
  })
  async login(
    @Body() loginInDto: LoginInDto,
  ): Promise<ResponseEntity<LoginOutDto>> {
    const loginOutDto = await this.service.login(loginInDto);

    return ResponseEntity.ok().body(loginOutDto);
  }

  @Post('refresh')
  @ApiResponseDocs({
    type: RefreshOutDto,
    errors: [
      AUTH_SERVER_ERROR_KEY.SESSION_NOT_FOUND,
      AUTH_SERVER_ERROR_KEY.SESSION_HASH_NOT_MATCH,
      AUTH_SERVER_ERROR_KEY.USER_NOT_FOUND,
    ],
  })
  async refresh(
    @Body() refreshInDto: RefreshInDto,
  ): Promise<ResponseEntity<RefreshOutDto>> {
    const refreshOutDto = await this.service.refreshToken(refreshInDto);

    return ResponseEntity.ok().body(refreshOutDto);
  }

  @Post('logout')
  async logout(
    @Body() logoutInDto: LogoutInDto,
  ): Promise<ResponseEntity<void>> {
    await this.service.logout(logoutInDto);

    return ResponseEntity.code(HttpStatus.NO_CONTENT).build();
  }
}
