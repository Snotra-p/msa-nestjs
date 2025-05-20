import { IsArray, IsMongoId, IsNotEmpty, Validate } from 'class-validator';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { REWARD_TYPE } from '../reward-type';
import { RewardContentValidator } from '../validator/reward-contents.validator';
import {
  AllRewardContentsDto,
  CouponRewardContentDto,
  ItemRewardContentDto,
  PointRewardContentDto,
} from './reward-contents.dto';

export const RewardContentDtoList = [
  PointRewardContentDto,
  ItemRewardContentDto,
  CouponRewardContentDto,
];

@ApiExtraModels(...RewardContentDtoList)
export class CreateRewardsInDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: 'array',
    oneOf: RewardContentDtoList.map((DtoClass) => ({
      $ref: getSchemaPath(DtoClass),
    })),
    description: '보상 배열',
    example: [
      { type: REWARD_TYPE.POINT, point: 100, quantity: 1 },
      { type: REWARD_TYPE.ITEM, itemName: '슈퍼박스', quantity: 2 },
      {
        type: REWARD_TYPE.COUPON,
        couponCode: 'WELCOME10',
        discount: 10,
        quantity: 1,
      },
    ],
  })
  @Validate(RewardContentValidator, { each: false })
  @IsArray()
  contents: AllRewardContentsDto[];
}
