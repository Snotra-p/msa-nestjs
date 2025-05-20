import { Types } from 'mongoose';

import { Rewards } from '../../../domain/rewards';
import { RewardsSchemaClass } from '../entities/rewards.schema';
import { RewardsContentMapper } from './rewards-content-mapper';

export class RewardsMapper {
  static toDomain(raw: RewardsSchemaClass): Rewards {
    const domainEntity = new Rewards();
    domainEntity.id = raw._id.toString();
    domainEntity.eventId = raw.eventId.toString();
    domainEntity.userId = raw.userId;

    if (raw.contents) {
      domainEntity.contents = raw.contents.map((it) =>
        RewardsContentMapper.toDomain(it),
      );
    }
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Rewards): RewardsSchemaClass {
    const persistenceSchema = new RewardsSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.userId = domainEntity.userId;
    persistenceSchema.eventId = new Types.ObjectId(domainEntity.eventId);
    if (domainEntity.contents) {
      persistenceSchema.contents = domainEntity.contents.map((it) =>
        RewardsContentMapper.toPersistence(it),
      );
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.deletedAt = domainEntity.deletedAt;
    return persistenceSchema;
  }
}
