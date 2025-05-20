import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  EventSchema,
  EventSchemaClass,
} from './infrastructure/persistence/entities/event.schema';
import { EventRepository } from './infrastructure/persistence/event.repository';
import { EventMongooseRepository } from './infrastructure/persistence/repositories/event.repository';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventSchemaClass.name, schema: EventSchema },
    ]),
  ],
  providers: [
    {
      provide: EventRepository,
      useClass: EventMongooseRepository,
    },
    EventsService,
  ],
  controllers: [EventsController],
  exports: [EventRepository],
})
export class EventsModule {}
