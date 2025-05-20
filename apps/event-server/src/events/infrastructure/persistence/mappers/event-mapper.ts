import { EventContentMapper } from './event-content-mapper';
import { EventSchemaClass } from '../entities/event.schema';
import { Event } from '../../../domain/event';

export class EventMapper {
  static toDomain(raw: EventSchemaClass): Event {
    const domainEntity = new Event();
    domainEntity.id = raw._id.toString();
    domainEntity.userId = raw.userId;
    domainEntity.activate = raw.activate;
    domainEntity.description = raw.description;
    domainEntity.startedAt = raw.startedAt;
    domainEntity.endedAt = raw.endedAt;
    domainEntity.requireApproval = raw.requireApproval;
    if (raw.contents) {
      domainEntity.contents = raw.contents.map((it) =>
        EventContentMapper.toDomain(it),
      );
    }
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Event): EventSchemaClass {
    const persistenceSchema = new EventSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.userId = domainEntity.userId;
    persistenceSchema.activate = domainEntity.activate;
    persistenceSchema.description = domainEntity.description;
    persistenceSchema.startedAt = domainEntity.startedAt;
    persistenceSchema.endedAt = domainEntity.endedAt;
    persistenceSchema.requireApproval = domainEntity.requireApproval;
    if (domainEntity.contents) {
      persistenceSchema.contents = domainEntity.contents.map((it) =>
        EventContentMapper.toPersistence(it),
      );
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.deletedAt = domainEntity.deletedAt;

    return persistenceSchema;
  }
}
