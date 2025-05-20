import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UserEventSchema,
  UserEventSchemaClass,
} from './infrastructure/persistence/entities/user-event.schema';
import { UserEventRepository } from './infrastructure/persistence/user-event.repository';
import { UserEventMongooseRepository } from './infrastructure/persistence/repositories/user-event.repository';
import { UserEventsController } from './user-events.controller';
import { UserEventsService } from './user-events.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEventSchemaClass.name, schema: UserEventSchema },
    ]),
    EventsModule,
  ],
  controllers: [UserEventsController],
  providers: [
    UserEventsService,
    {
      provide: UserEventRepository,
      useClass: UserEventMongooseRepository,
    },
  ],
  exports: [UserEventRepository],
})
export class UserEventsModule {}
