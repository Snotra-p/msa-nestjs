import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginInDto } from '@libs/shared/auth-server/auth/dto/login-in.dto';
import { LoginOutDto } from '@libs/shared/auth-server/auth/dto/login-out.dto';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { CreateUserInDto } from '@libs/shared/auth-server/users/dto/create-user-in.dto';
import { UserDto } from '@libs/shared/auth-server/users/dto/user.dto';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { HTTP_SERVICE_ERROR_KEY } from '@libs/shared/error/http-service-error';
import { RefreshOutDto } from '@libs/shared/auth-server/auth/dto/refresh-out.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthGatewayService } from './auth-gateway.service';
import { PASSPORT_STRATEGY } from '../auth/strategies/constant/passport.constant';
import { RefreshTokenPayload } from '../auth/strategies/decorator/refresh-token-payload.decorator';
import { JwtRefreshPayloadType } from '../auth/strategies/types/jwt-refresh-payload.type';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly service: AuthGatewayService) {}

  @Post('login')
  @ApiResponseDocs({
    type: LoginOutDto,
    errors: [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_LOGIN],
  })
  async login(
    @Body() loginInDto: LoginInDto,
  ): Promise<ResponseEntity<LoginOutDto>> {
    return await this.service.login(loginInDto);
  }

  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_REFRESH_STRATEGY))
  @Post('refresh')
  @ApiBearerAuth()
  @ApiResponseDocs({
    type: RefreshOutDto,
    errors: [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_REFRESH],
  })
  async refresh(
    @RefreshTokenPayload() payload: JwtRefreshPayloadType,
  ): Promise<ResponseEntity<RefreshOutDto>> {
    return await this.service.refreshToken({
      sessionId: payload.sessionId,
      hash: payload.hash,
    });
  }

  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_REFRESH_STRATEGY))
  @Post('logout')
  @ApiBearerAuth()
  @ApiResponseDocs({
    errors: [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_LOGOUT],
  })
  async logout(
    @RefreshTokenPayload() payload: JwtRefreshPayloadType,
  ): Promise<ResponseEntity<void>> {
    return await this.service.logout({
      sessionId: payload.sessionId,
    });
  }

  @Post('users')
  @ApiResponseDocs({
    type: UserDto,
    errors: [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_CREATE_USER],
  })
  async createUser(
    @Body() createUserInDto: CreateUserInDto,
  ): Promise<ResponseEntity<UserDto>> {
    return await this.service.createUser(createUserInDto);
  }
}
