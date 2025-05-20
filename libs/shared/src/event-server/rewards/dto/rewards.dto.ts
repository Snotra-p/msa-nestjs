import { BaseDto } from '@libs/core/dto/base.dto';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { RewardContentDtoList } from './create-rewards-in.dto';
import { REWARD_TYPE } from '../reward-type';
import { AllRewardContentsDto } from './reward-contents.dto';
export class RewardsDto extends BaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;
  @ApiProperty()
  eventId: string;

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
  contents: AllRewardContentsDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
