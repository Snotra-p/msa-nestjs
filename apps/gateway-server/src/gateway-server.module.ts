import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from '@libs/core/filter/all-exception.filter';

import appConfig from './config/app.config';
import httpServiceConfig from './http/config/http-service.config';
import authStrategyConfig from './auth/\bconfig/auth-strategy.config';
import { AuthGatewayModule } from './auth-gateway/auth-gateway.module';
import { EventGatewayModule } from './event-gateway/event-gateway.module';
import { GatewayServerExceptionModule } from './exception/gateway-server-exception.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authStrategyConfig, httpServiceConfig],
      envFilePath: [
        `./apps/gateway-server/.${process.env.NODE_ENV ?? 'test'}.gate.env`,
      ],
    }),
    AuthGatewayModule,
    EventGatewayModule,
    GatewayServerExceptionModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class GatewayServerModule {}
