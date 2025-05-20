import { RewardsClaimStatus } from '@libs/shared/event-server/user-rewards-claims/reward-claim-status';

export class UserRewardsClaim {
  id: string;
  userId: string;
  eventId: string;
  rewardsId: string;
  status: RewardsClaimStatus;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
