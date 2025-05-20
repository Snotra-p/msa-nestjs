import validateConfig from '@libs/core/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

export type DatabaseConfig = {
  url: string;
  password: string;
  name: string;
  username: string;
};

class EnvironmentVariablesValidator {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USERNAME: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  const config = validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    url: config.DATABASE_URL,
    name: config.DATABASE_NAME,
    username: config.DATABASE_USERNAME,
    password: config.DATABASE_PASSWORD,
  };
});
