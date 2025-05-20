import { AllRewardContents } from './reward-content';

export class Rewards {
  id: string;
  eventId: string;
  userId: string;
  contents: AllRewardContents[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
