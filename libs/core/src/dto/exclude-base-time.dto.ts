import { Exclude } from 'class-transformer';

import { BaseDto } from './base.dto';

export class ExcludeBaseTimeDto extends BaseDto {
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
