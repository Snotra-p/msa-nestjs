import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventSchema, EventSchemaClass } from './entities/event.schema';
import { EventRepository } from './event.repository';
import { EventMongooseRepository } from './repositories/event.repository';
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
  ],
  exports: [EventRepository],
})
export class EventPersistenceModule {}
