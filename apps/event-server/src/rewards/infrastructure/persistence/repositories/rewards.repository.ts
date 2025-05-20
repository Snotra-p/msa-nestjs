import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NullableType } from '@libs/core/types/nullable.type';

import { RewardsRepository } from '../rewards.repository';
import { RewardsSchemaClass } from '../entities/rewards.schema';
import { Rewards } from '../../../domain/rewards';
import { RewardsMapper } from '../mappers/rewards-mapper';

@Injectable()
export class RewardsMongooseRepository implements RewardsRepository {
  constructor(
    @InjectModel(RewardsSchemaClass.name)
    private readonly rewardsModel: Model<RewardsSchemaClass>,
  ) {}

  getModel(): Model<RewardsSchemaClass> {
    return this.rewardsModel;
  }

  async findAll(): Promise<Rewards[]> {
    const rewardObjects = await this.rewardsModel.find();
    return rewardObjects.map((rewardObject) =>
      RewardsMapper.toDomain(rewardObject),
    );
  }

  async create(data: Rewards): Promise<Rewards> {
    const persistenceModel = RewardsMapper.toPersistence(data);

    const createdReward = new this.rewardsModel(persistenceModel);
    const rewardObject = await createdReward.save();

    return RewardsMapper.toDomain(rewardObject);
  }

  async findById(id: Rewards['id']): Promise<NullableType<Rewards>> {
    const rewardObject = await this.rewardsModel.findById(id);
    return rewardObject ? RewardsMapper.toDomain(rewardObject) : null;
  }

  async findByEventId(
    eventId: Rewards['eventId'],
  ): Promise<NullableType<Rewards>> {
    const rewardObject = await this.rewardsModel.findOne({ eventId });
    return rewardObject ? RewardsMapper.toDomain(rewardObject) : null;
  }
}
