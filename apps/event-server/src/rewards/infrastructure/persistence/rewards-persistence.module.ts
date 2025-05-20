import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RewardsRepository } from './rewards.repository';
import { RewardsSchemaClass, RewardsSchema } from './entities/rewards.schema';
import { RewardsMongooseRepository } from './repositories/rewards.repository';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RewardsSchemaClass.name,
        schema: RewardsSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: RewardsRepository,
      useClass: RewardsMongooseRepository,
    },
  ],
  exports: [RewardsRepository],
})
export class RewardsPersistenceModule {}
