import { plainToInstance } from 'class-transformer';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validateSync,
} from 'class-validator';

import {
  PointRewardContentDto,
  ItemRewardContentDto,
  CouponRewardContentDto,
  AllRewardContentsDto,
} from '../dto/reward-contents.dto';
import { REWARD_TYPE } from '../reward-type';

@ValidatorConstraint({ name: 'RewardContentValidator', async: false })
export class RewardContentValidator implements ValidatorConstraintInterface {
  validate(values: AllRewardContentsDto[]) {
    return values.every((item) => {
      if (item.type === REWARD_TYPE.POINT) {
        return (
          validateSync(plainToInstance(PointRewardContentDto, item)).length ===
          0
        );
      } else if (item.type === REWARD_TYPE.ITEM) {
        return (
          validateSync(plainToInstance(ItemRewardContentDto, item)).length === 0
        );
      } else if (item.type === REWARD_TYPE.COUPON) {
        return (
          validateSync(plainToInstance(CouponRewardContentDto, item)).length ===
          0
        );
      }
      return false;
    });
  }
}
