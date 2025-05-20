import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import ms, { StringValue } from 'ms';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { UserDto } from '@libs/shared/auth-server/users/dto/user.dto';

import { AllAuthConfigType } from '../config/config.type';
import { LoginInDto } from '../../../../libs/shared/src/auth-server/auth/dto/login-in.dto';
import { LoginOutDto } from '../../../../libs/shared/src/auth-server/auth/dto/login-out.dto';
import { AuthServerException } from '../error/auth-server-exception';
import { AUTH_SERVER_ERROR_KEY } from '../error/auth-server-error';
import { UserRepository } from '../users/infrastructure/persistence/user.repository';
import { Session } from '../session/domain/session';
import { User } from '../users/domain/user';
import { RefreshOutDto } from '../../../../libs/shared/src/auth-server/auth/dto/refresh-out.dto';
import { RefreshInDto } from '../../../../libs/shared/src/auth-server/auth/dto/refresh-in.dto';
import { LogoutInDto } from '../../../../libs/shared/src/auth-server/auth/dto/logout-in.dto';
import { SessionProvider } from '../session/session.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AllAuthConfigType>,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UserRepository,
    private readonly sessionProvider: SessionProvider,
  ) {}

  async login(loginDto: LoginInDto): Promise<LoginOutDto> {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AuthServerException(AUTH_SERVER_ERROR_KEY.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthServerException(
        AUTH_SERVER_ERROR_KEY.AUTH_PASSWORD_INCORRECT,
      );
    }

    let session = await this.sessionProvider.findByUserId(user.id);

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    if (session) {
      await this.sessionProvider.update(session.id, {
        hash,
      });
    } else {
      session = await this.sessionProvider.create({
        user,
        hash,
      });
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return LoginOutDto.of({
      refreshToken,
      token,
      tokenExpires,
      user: UserDto.fromEntity(user),
    });
  }

  async refreshToken(
    refreshInDto: RefreshInDto,
  ): Promise<Omit<LoginOutDto, 'user'>> {
    const session = await this.sessionProvider.findById(refreshInDto.sessionId);

    if (!session) {
      throw new AuthServerException(AUTH_SERVER_ERROR_KEY.SESSION_NOT_FOUND);
    }

    if (session.hash !== refreshInDto.hash) {
      throw new AuthServerException(
        AUTH_SERVER_ERROR_KEY.SESSION_HASH_NOT_MATCH,
      );
    }

    const user = await this.usersRepository.findById(session.user.id);

    if (!user) {
      throw new AuthServerException(AUTH_SERVER_ERROR_KEY.USER_NOT_FOUND);
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.sessionProvider.update(session.id, {
      hash,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
      hash,
    });

    return RefreshOutDto.of({
      token,
      refreshToken,
      tokenExpires,
    });
  }

  async logout(logoutInDto: LogoutInDto): Promise<void> {
    await this.sessionProvider.deleteById(logoutInDto.sessionId);
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }): Promise<{
    token: string;
    refreshToken: string;
    tokenExpires: number;
  }> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn as StringValue);

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          privateKey: this.configService.getOrThrow('auth.privateSecret', {
            infer: true,
          }),
          algorithm: 'RS256',
          expiresIn: tokenExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          privateKey: this.configService.getOrThrow(
            'auth.refreshPrivateSecret',
            {
              infer: true,
            },
          ),
          algorithm: 'RS256',
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
