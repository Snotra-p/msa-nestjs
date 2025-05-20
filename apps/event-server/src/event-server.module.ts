import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { RewardsModule } from './rewards/rewards.module';
import databaseConfig from './database/database.config';
import { MongooseConfigService } from './database/mongoose-config.service';
import { EventsModule } from './events/events.module';
import { UserRewardsClaimsModule } from './user-rewards-claims/user-rewards-claims.module';
import { UserEventsModule } from './user-events/user-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      cache: true,
      envFilePath: `./apps/event-server/.${process.env.NODE_ENV ?? 'test'}.event.env`,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    RewardsModule,
    EventsModule,
    UserRewardsClaimsModule,
    UserEventsModule,
  ],
  controllers: [],
  providers: [],
})
export class EventServerModule {}
