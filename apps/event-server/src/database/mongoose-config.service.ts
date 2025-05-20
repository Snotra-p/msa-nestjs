import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

import databaseConfig from './database.config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: ConfigType<typeof databaseConfig>,
  ) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.dbConfig.url,
      dbName: this.dbConfig.name,
      user: this.dbConfig.username,
      pass: this.dbConfig.password,
    };
  }
}
