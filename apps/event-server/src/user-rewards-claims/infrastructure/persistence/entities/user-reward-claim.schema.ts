import {
  REWARDS_CLAIM_STATUS,
  RewardsClaimStatus,
} from '@libs/shared/event-server/user-rewards-claims/reward-claim-status';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';

export type UserRewardClaimSchemaDocument =
  HydratedDocument<UserRewardsClaimSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserRewardsClaimSchemaClass {
  _id: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Reward', required: true })
  rewardsId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(REWARDS_CLAIM_STATUS),
    required: true,
  })
  status: RewardsClaimStatus;

  @Prop({ type: String, default: null })
  processUserId?: string | null;

  @Prop({ type: Date })
  processedAt?: Date | null;

  @Prop({ type: Date, default: null })
  completedAt?: Date | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserRewardsClaimSchema = SchemaFactory.createForClass(
  UserRewardsClaimSchemaClass,
);

UserRewardsClaimSchema.index({ userId: 1, eventId: 1 }, { unique: true });
