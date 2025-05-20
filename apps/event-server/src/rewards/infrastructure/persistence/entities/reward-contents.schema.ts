import {
  REWARD_TYPE,
  RewardType,
} from '@libs/shared/event-server/rewards/reward-type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, discriminatorKey: 'type' })
export class RewardContents {
  @Prop({ required: true, enum: Object.values(REWARD_TYPE) })
  type: RewardType;

  @Prop({
    required: true,
    min: 1, // 최소값 설정
    description: '보상 수량',
  })
  quantity: number;
}

export const RewardContentsSchema =
  SchemaFactory.createForClass(RewardContents);

// PointReward
@Schema()
export class PointRewardContentClass {
  type: RewardType;

  quantity: number;

  @Prop({ type: Number, required: true })
  point: number;
}

export const PointRewardContentSchema = SchemaFactory.createForClass(
  PointRewardContentClass,
);

// ItemReward
@Schema()
export class ItemRewardContentClass {
  type: RewardType;

  quantity: number;

  @Prop({ type: String, required: true })
  itemName: string;
}

export const ItemRewardContentSchema = SchemaFactory.createForClass(
  ItemRewardContentClass,
);

// CouponReward
@Schema()
export class CouponRewardContentClass {
  type: RewardType;

  quantity: number;

  @Prop({ type: String, required: true })
  couponCode: string;

  @Prop({ type: Number, required: true })
  discount: number;
}

export const CouponRewardContentSchema = SchemaFactory.createForClass(
  CouponRewardContentClass,
);

export type AllRewardContentsSchemaClass =
  | PointRewardContentClass
  | ItemRewardContentClass
  | CouponRewardContentClass;
