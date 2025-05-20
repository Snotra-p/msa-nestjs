import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@libs/core/dto/base.dto';
import { Exclude } from 'class-transformer';
import { getSchemaPath } from '@nestjs/swagger/dist/utils/get-schema-path.util';

import {
  AllEventContentsDto,
  EVENT_CONTENT_DTO_LIST,
} from './event-contents.dto';
import { EVENT_TYPE } from '../event-type';

@ApiExtraModels(...EVENT_CONTENT_DTO_LIST)
export class EventDto extends BaseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  activate: boolean;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty()
  endedAt: Date;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: 'array',
    oneOf: EVENT_CONTENT_DTO_LIST.map((DtoClass) => ({
      $ref: getSchemaPath(DtoClass),
    })),
    description:
      '이벤트 조건(여러가지 복수 조건이 있을수도, 하나만 있을수도 있음)',
    example: [
      { type: EVENT_TYPE.ATTENDANCE, count: 1 },
      { type: EVENT_TYPE.CONSECUTIVE_ATTENDANCE, count: 2 },
      {
        type: EVENT_TYPE.QUEST_CLEAR,
        count: 1,
        dataQuestId: 1,
        name: '퀘스트 클리어',
      },
      {
        type: EVENT_TYPE.FRIEND_INVITE,
        count: 1,
        invitedUserIds: ['1', '2', '3'],
      },
    ],
  })
  contents: AllEventContentsDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
