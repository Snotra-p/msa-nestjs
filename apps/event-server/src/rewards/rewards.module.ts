import { Module } from '@nestjs/common';

import { RewardsPersistenceModule } from './infrastructure/persistence/rewards-persistence.module';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [RewardsPersistenceModule, EventsModule],
  providers: [RewardsService],
  controllers: [RewardsController],
  exports: [RewardsPersistenceModule],
})
export class RewardsModule {}
