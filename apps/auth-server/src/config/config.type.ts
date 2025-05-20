// import { AppConfig } from './app-config.type';
import { DatabaseConfig } from '../database/database.config';
import { AuthConfig } from '../auth/config/auth.config';
import { AuthAppConfig } from './auth-app.config';

export type AllAuthConfigType = {
  authApp: AuthAppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
};
