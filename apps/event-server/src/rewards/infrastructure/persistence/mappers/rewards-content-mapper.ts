import { REWARD_TYPE } from '@libs/shared/event-server/rewards/reward-type';

import {
  AllRewardContentsSchemaClass as AllRewardContentsSchemaClass,
  CouponRewardContentClass,
  ItemRewardContentClass,
  PointRewardContentClass,
} from '../entities/reward-contents.schema';
import {
  AllRewardContents,
  CouponRewardContent,
  ItemRewardContent,
  PointRewardContent,
} from '../../../domain/reward-content';

const isPointRewardContent = (
  schema: AllRewardContentsSchemaClass,
): schema is PointRewardContentClass => schema.type === REWARD_TYPE.POINT;

const isItemRewardContent = (
  schema: AllRewardContentsSchemaClass,
): schema is ItemRewardContentClass => schema.type === REWARD_TYPE.ITEM;

const isCouponRewardContent = (
  schema: AllRewardContentsSchemaClass,
): schema is CouponRewardContentClass => schema.type === REWARD_TYPE.COUPON;

export class RewardsContentMapper {
  static toDomain(schema: AllRewardContentsSchemaClass): AllRewardContents {
    if (isPointRewardContent(schema)) {
      return {
        type: REWARD_TYPE.POINT,
        point: schema.point,
        quantity: schema.quantity,
      } satisfies PointRewardContent;
    } else if (isItemRewardContent(schema)) {
      return {
        type: REWARD_TYPE.ITEM,
        itemName: schema.itemName,
        quantity: schema.quantity,
      } satisfies ItemRewardContent;
    } else if (isCouponRewardContent(schema)) {
      return {
        type: REWARD_TYPE.COUPON,
        couponCode: schema.couponCode,
        discount: schema.discount,
        quantity: schema.quantity,
      } satisfies CouponRewardContent;
    }

    throw new Error('Invalid reward content type');
  }

  static toPersistence(domain: AllRewardContents) {
    if (domain.type === REWARD_TYPE.POINT) {
      const persistence = new PointRewardContentClass();
      persistence.type = domain.type;
      persistence.point = domain.point;
      persistence.quantity = domain.quantity;
      return persistence;
    } else if (domain.type === REWARD_TYPE.ITEM) {
      const persistence = new ItemRewardContentClass();
      persistence.type = domain.type;
      persistence.itemName = domain.itemName;
      persistence.quantity = domain.quantity;
      return persistence;
    } else if (domain.type === REWARD_TYPE.COUPON) {
      const persistence = new CouponRewardContentClass();
      persistence.type = domain.type;
      persistence.couponCode = domain.couponCode;
      persistence.discount = domain.discount;
      persistence.quantity = domain.quantity;
      return persistence;
    }

    throw new Error('Invalid reward content type');
  }
}
