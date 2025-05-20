import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SessionSchema, SessionSchemaClass } from './entities/session.schema';
import { SessionRepository } from './session.repository';
import { SessionDocumentRepository as SessionMongooseRepository } from './repositories/session.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SessionSchemaClass.name, schema: SessionSchema },
    ]),
  ],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionMongooseRepository,
    },
  ],
  exports: [SessionRepository],
})
export class SessionPersistenceModule {}
