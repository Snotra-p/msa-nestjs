import { Document, Types } from 'mongoose';

import { UserRewardsClaimSchemaClass } from '../entities/user-reward-claim.schema';
import { UserRewardsClaim } from '../../../domain/user-rewards-claim';

export class UserRewardClaimMapper {
  static toDomain(raw: UserRewardsClaimSchemaClass): UserRewardsClaim {
    const domainEntity = new UserRewardsClaim();
    domainEntity.id = raw._id.toString();
    domainEntity.userId = raw.userId;
    domainEntity.eventId = raw.eventId.toString();
    domainEntity.rewardsId = raw.rewardsId.toString();
    domainEntity.status = raw.status;
    domainEntity.processedAt = raw.processedAt ?? null;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: UserRewardsClaim,
  ): UserRewardsClaimSchemaClass {
    const persistenceSchema = new UserRewardsClaimSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.userId = domainEntity.userId;
    persistenceSchema.eventId = new Types.ObjectId(domainEntity.eventId);
    persistenceSchema.rewardsId = new Types.ObjectId(domainEntity.rewardsId);
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.processedAt = domainEntity.processedAt;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.deletedAt = domainEntity.deletedAt;

    return persistenceSchema;
  }
}
