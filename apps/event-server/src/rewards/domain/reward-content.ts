import { REWARD_TYPE } from '@libs/shared/event-server/rewards/reward-type';

export type ItemRewardContent = {
  type: typeof REWARD_TYPE.ITEM;
  itemName: string;
  quantity: number;
};

export type PointRewardContent = {
  type: typeof REWARD_TYPE.POINT;
  point: number;
  quantity: number;
};

export type CouponRewardContent = {
  type: typeof REWARD_TYPE.COUPON;
  couponCode: string;
  discount: number;
  quantity: number;
};

export type AllRewardContents =
  | ItemRewardContent
  | PointRewardContent
  | CouponRewardContent;
