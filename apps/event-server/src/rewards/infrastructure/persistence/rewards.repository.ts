import { NullableType } from '@libs/core/types/nullable.type';
import { Model } from 'mongoose';

import { Rewards } from '../../domain/rewards';
import { RewardsSchemaClass } from './entities/rewards.schema';

export abstract class RewardsRepository {
  abstract getModel(): Model<RewardsSchemaClass>;
  abstract create(
    data: Omit<Rewards, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Rewards>;

  abstract findById(id: Rewards['id']): Promise<NullableType<Rewards>>;

  abstract findByEventId(
    eventId: Rewards['eventId'],
  ): Promise<NullableType<Rewards>>;

  abstract findAll(): Promise<Rewards[]>;
}
