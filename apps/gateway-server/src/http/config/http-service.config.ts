import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from '@libs/core/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_SERVER_HOST: string;

  @IsString()
  AUTH_SERVER_PORT: string;

  @IsString()
  EVENT_SERVER_HOST: string;

  @IsString()
  EVENT_SERVER_PORT: string;
}

export default registerAs<HttpServiceConfig>('httpService', () => {
  const config = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    authServerHost: config.AUTH_SERVER_HOST,
    authServerPort: config.AUTH_SERVER_PORT,
    eventServerHost: config.EVENT_SERVER_HOST,
    eventServerPort: config.EVENT_SERVER_PORT,
  };
});

export type HttpServiceConfig = {
  authServerHost: string;
  authServerPort: string;
  eventServerHost: string;
  eventServerPort: string;
};
