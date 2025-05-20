import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SessionModule } from '../session/session.module';
import { AllAuthConfigType } from '../config/config.type';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<AllAuthConfigType>) => ({
        privateKey: configService.getOrThrow('auth.privateSecret', {
          infer: true,
        }),
        signOptions: {
          algorithm: process.env.JWT_ALGORITHM as 'RS256',
          expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    SessionModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
