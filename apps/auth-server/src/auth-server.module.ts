import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AllExceptionFilter } from '@libs/core/filter/all-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { AuthServerExceptionModule } from './exception/auth-server-exception.module';
import { MongooseConfigService } from './database/mongoose-config.service';
import databaseConfig from './database/database.config';
import { UsersModule } from './users/users.module';
import authConfig from './auth/config/auth.config';
import authAppConfig from './config/auth-app.config';

@Module({
  imports: [
    AuthModule,
    AuthServerExceptionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, authAppConfig],
      cache: true,
      envFilePath: `./apps/auth-server/.${process.env.NODE_ENV ?? 'test'}.auth.env`,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),

    UsersModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AuthServerModule {}
