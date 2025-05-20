import { IsNotEmpty, IsEnum, IsString, IsNumber, Min } from 'class-validator';

import { REWARD_TYPE } from '../reward-type';

export class PointRewardContentDto {
  @IsEnum([REWARD_TYPE.POINT])
  type: typeof REWARD_TYPE.POINT;

  @IsNumber()
  @Min(1)
  point: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ItemRewardContentDto {
  @IsEnum([REWARD_TYPE.ITEM])
  type: typeof REWARD_TYPE.ITEM;

  @IsString()
  @IsNotEmpty()
  itemName: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CouponRewardContentDto {
  @IsEnum([REWARD_TYPE.COUPON])
  type: typeof REWARD_TYPE.COUPON;

  @IsString()
  @IsNotEmpty()
  couponCode: string;

  @IsNumber()
  discount: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export type AllRewardContentsDto =
  | PointRewardContentDto
  | ItemRewardContentDto
  | CouponRewardContentDto;
