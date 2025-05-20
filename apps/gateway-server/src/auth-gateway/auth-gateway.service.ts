import { LoginOutDto } from '@libs/shared/auth-server/auth/dto/login-out.dto';
import { LoginInDto } from '@libs/shared/auth-server/auth/dto/login-in.dto';
import { Injectable } from '@nestjs/common';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { HTTP_SERVICE_ERROR_KEY } from '@libs/shared/error/http-service-error';
import { CreateUserInDto } from '@libs/shared/auth-server/users/dto/create-user-in.dto';
import { UserDto } from '@libs/shared/auth-server/users/dto/user.dto';
import { RefreshOutDto } from '@libs/shared/auth-server/auth/dto/refresh-out.dto';
import { RefreshInDto } from '@libs/shared/auth-server/auth/dto/refresh-in.dto';
import { LogoutInDto } from '@libs/shared/auth-server/auth/dto/logout-in.dto';

import { AuthHttpProvider } from '../http/auth/auth-http.provider';

@Injectable()
export class AuthGatewayService {
  constructor(private readonly authHttpProvider: AuthHttpProvider) {}

  async login(loginInDto: LoginInDto): Promise<ResponseEntity<LoginOutDto>> {
    return await this.authHttpProvider.request<LoginOutDto>(
      {
        url: '/auth/login',
        method: 'POST',
        body: loginInDto,
      },
      HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_LOGIN,
    );
  }

  async refreshToken(
    refreshInDto: RefreshInDto,
  ): Promise<ResponseEntity<RefreshOutDto>> {
    return await this.authHttpProvider.request<RefreshOutDto>(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: refreshInDto,
      },
      HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_REFRESH,
    );
  }

  async logout(logoutInDto: LogoutInDto): Promise<ResponseEntity<void>> {
    return await this.authHttpProvider.request<void>(
      {
        url: '/auth/logout',
        method: 'POST',
        body: logoutInDto,
      },
      HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_LOGOUT,
    );
  }

  async createUser(
    createUserInDto: CreateUserInDto,
  ): Promise<ResponseEntity<UserDto>> {
    return await this.authHttpProvider.request<UserDto>(
      {
        url: '/users',
        method: 'POST',
        body: createUserInDto,
      },
      HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_CREATE_USER,
    );
  }
}
