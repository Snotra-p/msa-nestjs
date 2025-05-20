import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthGatewayController } from './auth-gateway.controller';
import { AuthGatewayService } from './auth-gateway.service';
import { AuthHttpProvider } from '../http/auth/auth-http.provider';
import { GatewayAuthModule } from '../auth/gateway-auth.module';

@Module({
  imports: [HttpModule, GatewayAuthModule],
  controllers: [AuthGatewayController],
  providers: [AuthGatewayService, AuthHttpProvider],
})
export class AuthGatewayModule {}
