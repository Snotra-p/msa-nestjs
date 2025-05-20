import { AuthStrategyConfig } from '../auth/\bconfig/auth-strategy.config';
import { HttpServiceConfig } from '../http/config/http-service.config';
import { GatewayAppConfig } from './app.config';

export type AllGateWayConfigType = {
  gatewayApp: GatewayAppConfig;
  httpService: HttpServiceConfig;
  authStrategy: AuthStrategyConfig;
};
