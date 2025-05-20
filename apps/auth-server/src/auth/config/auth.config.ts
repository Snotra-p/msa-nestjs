import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from '@libs/core/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_PRIVATE_SECRET: string;

  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_REFRESH_PRIVATE_SECRET: string;

  @IsString()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  const config = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    privateSecret: Buffer.from(
      config.AUTH_JWT_PRIVATE_SECRET,
      'base64',
    ).toString('utf-8'),
    refreshPrivateSecret: Buffer.from(
      config.AUTH_REFRESH_PRIVATE_SECRET,
      'base64',
    ).toString('utf-8'),
    expires: config.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshExpires: config.AUTH_REFRESH_TOKEN_EXPIRES_IN,
  };
});

export type AuthConfig = {
  privateSecret: string;
  refreshPrivateSecret: string;
  expires: string;
  refreshExpires: string;
};
