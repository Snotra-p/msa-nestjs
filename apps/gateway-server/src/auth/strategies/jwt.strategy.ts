import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { JwtPayloadType } from './types/jwt-payload.type';
import { PASSPORT_STRATEGY } from './constant/passport.constant';
import authStrategyConfig, {
  AuthStrategyConfig,
} from '../\bconfig/auth-strategy.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  PASSPORT_STRATEGY.JWT_STRATEGY,
) {
  constructor(
    @Inject(authStrategyConfig.KEY)
    private readonly authStrategyConfig: AuthStrategyConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authStrategyConfig.publicSecret,
      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtPayloadType): JwtPayloadType {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
