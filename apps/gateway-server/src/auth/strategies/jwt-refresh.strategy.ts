import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';
import { PASSPORT_STRATEGY } from './constant/passport.constant';
import authStrategyConfig, {
  AuthStrategyConfig,
} from '../\bconfig/auth-strategy.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  PASSPORT_STRATEGY.JWT_REFRESH_STRATEGY,
) {
  constructor(
    @Inject(authStrategyConfig.KEY)
    private readonly authStrategyConfig: AuthStrategyConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authStrategyConfig.refreshPublicSecret,
      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtRefreshPayloadType): JwtRefreshPayloadType {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
