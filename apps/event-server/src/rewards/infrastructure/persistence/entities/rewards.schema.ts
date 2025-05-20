import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';
import { REWARD_TYPE } from '@libs/shared/event-server/rewards/reward-type';

import {
  CouponRewardContentSchema,
  RewardContentsSchema,
  ItemRewardContentSchema,
  PointRewardContentSchema,
  AllRewardContentsSchemaClass,
} from './reward-contents.schema';

export type RewardsSchemaDocument = HydratedDocument<RewardsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class RewardsSchemaClass {
  _id: string;

  @Prop({ type: String, required: true })
  userId: string; // 보상을 등록한 유저아이디

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({
    type: [RewardContentsSchema],
    required: true,
  })
  contents: AllRewardContentsSchemaClass[];

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}
export const RewardsSchema = SchemaFactory.createForClass(RewardsSchemaClass);

RewardsSchema.index({ eventId: 1 }, { unique: true });
RewardsSchema.index({ userId: 1 });

RewardsSchema.path('contents').schema.discriminator(
  REWARD_TYPE.POINT,
  PointRewardContentSchema,
  { value: REWARD_TYPE.POINT }, // 명시적으로 type 값 설정
);

RewardsSchema.path('contents').schema.discriminator(
  REWARD_TYPE.ITEM,
  ItemRewardContentSchema,
  { value: REWARD_TYPE.ITEM },
);

RewardsSchema.path('contents').schema.discriminator(
  REWARD_TYPE.COUPON,
  CouponRewardContentSchema,
  { value: REWARD_TYPE.COUPON },
);
