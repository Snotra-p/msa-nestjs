import { BaseDto } from '@libs/core/dto/base.dto';
import {
  REWARDS_CLAIM_STATUS,
  RewardsClaimStatus,
} from '@libs/shared/event-server/user-rewards-claims/reward-claim-status';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserRewardsClaimDto extends BaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  rewardsId: string;

  @ApiProperty({
    enum: Object.values(REWARDS_CLAIM_STATUS),
  })
  status: RewardsClaimStatus;

  @ApiProperty()
  processedAt: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
