import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  UserRewardsClaimSchema,
  UserRewardsClaimSchemaClass,
} from './infrastructure/persistence/entities/user-reward-claim.schema';
import { UserRewardClaimMongooseRepository } from './infrastructure/persistence/repositories/user-reward-claim.repository';
import { UserRewardsClaimsService } from './user-rewards-claims.service';
import { UserRewardsClaimsController } from './user-rewards-claims.controller';
import { EventsModule } from '../events/events.module';
import { RewardsModule } from '../rewards/rewards.module';
import { UserEventsModule } from '../user-events/user-events.module';
import { UserRewardClaimRepository } from './infrastructure/persistence/user-reward-claim.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserRewardsClaimSchemaClass.name,
        schema: UserRewardsClaimSchema,
      },
    ]),
    EventsModule,
    RewardsModule,
    UserEventsModule,
  ],
  controllers: [UserRewardsClaimsController],
  providers: [
    UserRewardsClaimsService,
    {
      provide: UserRewardClaimRepository,
      useClass: UserRewardClaimMongooseRepository,
    },
  ],
  exports: [UserRewardClaimRepository],
})
export class UserRewardsClaimsModule {}
