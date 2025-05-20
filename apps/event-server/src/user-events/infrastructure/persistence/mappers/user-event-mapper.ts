import { Document, Types } from 'mongoose';
import { EventContentMapper } from 'apps/event-server/src/events/infrastructure/persistence/mappers/event-content-mapper';

import { UserEventSchemaClass } from '../entities/user-event.schema';
import { UserEvent } from '../../../domain/user-event';

export class UserEventMapper {
  static toDomain(raw: Document & UserEventSchemaClass): UserEvent {
    const domainEntity = new UserEvent();
    domainEntity.id = raw._id.toString();
    domainEntity.userId = raw.userId;
    domainEntity.eventId = raw.eventId.toString();

    if (raw.contents) {
      domainEntity.contents = EventContentMapper.toDomain(raw.contents);
    }
    domainEntity.completedAt = raw.completedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: UserEvent): UserEventSchemaClass {
    const persistenceSchema = new UserEventSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.userId = domainEntity.userId;
    persistenceSchema.eventId = new Types.ObjectId(domainEntity.eventId);
    persistenceSchema.contents = EventContentMapper.toPersistence(
      domainEntity.contents,
    );
    persistenceSchema.completedAt = domainEntity.completedAt;

    return persistenceSchema;
  }
}
