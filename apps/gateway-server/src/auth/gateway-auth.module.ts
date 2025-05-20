import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PASSPORT_STRATEGY } from './strategies/constant/passport.constant';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: PASSPORT_STRATEGY.JWT_STRATEGY,
    }),
  ],
  providers: [JwtStrategy, JwtRefreshStrategy],
})
export class GatewayAuthModule {}
