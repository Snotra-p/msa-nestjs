import validateConfig from '@libs/core/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Environment } from '@libs/core/constants/environment';
class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsString()
  @IsOptional()
  API_PREFIX: string;
}

export default registerAs<AuthAppConfig>('authApp', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: (process.env.NODE_ENV || 'test') as Environment,
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
  };
});

export type AuthAppConfig = {
  nodeEnv: Environment;
  port: number;
  apiPrefix: string;
};
