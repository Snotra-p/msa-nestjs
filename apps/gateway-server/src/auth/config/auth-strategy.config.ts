import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from '@libs/core/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  JWT_PUBLIC_SECRET: string;

  @IsString()
  JWT_REFRESH_PUBLIC_SECRET: string;
}

export default registerAs<AuthStrategyConfig>('authStrategy', () => {
  const config = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    publicSecret: Buffer.from(config.JWT_PUBLIC_SECRET, 'base64').toString(
      'utf-8',
    ),
    refreshPublicSecret: Buffer.from(
      config.JWT_REFRESH_PUBLIC_SECRET,
      'base64',
    ).toString('utf-8'),
  };
});

export type AuthStrategyConfig = {
  publicSecret: string;
  refreshPublicSecret: string;
};
