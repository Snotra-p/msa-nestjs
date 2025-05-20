import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@libs/core/dto/base.dto';
import { Exclude } from 'class-transformer';
import { getSchemaPath } from '@nestjs/swagger/dist/utils/get-schema-path.util';

import {
  AllEventContentsDto,
  EVENT_CONTENT_DTO_LIST,
} from '../../event/dto/event-contents.dto';

@ApiExtraModels(...EVENT_CONTENT_DTO_LIST)
export class UserEventDto extends BaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty({
    oneOf: EVENT_CONTENT_DTO_LIST.map((DtoClass) => ({
      $ref: getSchemaPath(DtoClass),
    })),
    description: '이벤트 조건',
  })
  contents: AllEventContentsDto;

  @ApiProperty()
  completedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
