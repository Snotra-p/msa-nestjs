import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';
import { getSchemaPath } from '@nestjs/swagger/dist/utils/get-schema-path.util';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { EVENT_TYPE } from '../event-type';
import {
  AllEventContentsDto,
  EVENT_CONTENT_DTO_LIST,
} from './event-contents.dto';
import { EventContentsValidator } from '../validator/event-contents.validator';

@ApiExtraModels(...EVENT_CONTENT_DTO_LIST)
export class CreateEventInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1' || value === true) return true;
    if (value === 'false' || value === '0' || value === false) return false;
    return !!value;
  })
  activate: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startedAt: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endedAt: Date;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === '1' || value === true) return true;
    if (value === 'false' || value === '0' || value === false) return false;
    return !!value;
  })
  requireApproval: boolean;

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
  @Validate(EventContentsValidator, { each: false })
  @IsArray()
  contents: AllEventContentsDto[];
}
