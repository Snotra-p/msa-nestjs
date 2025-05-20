import {
  IsArray,
  IsNotEmpty,
  IsString,
  Min,
  IsInt,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { EVENT_TYPE } from '../event-type';

export class AttendanceContentDto {
  @ApiProperty({
    type: String,
    example: EVENT_TYPE.ATTENDANCE,
  })
  @IsEnum([EVENT_TYPE.ATTENDANCE])
  type: typeof EVENT_TYPE.ATTENDANCE;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(1)
  count: number;
}

export class ConsecutiveAttendanceContentDto {
  @ApiProperty({
    type: String,
    example: EVENT_TYPE.CONSECUTIVE_ATTENDANCE,
  })
  @IsEnum([EVENT_TYPE.CONSECUTIVE_ATTENDANCE])
  type: typeof EVENT_TYPE.CONSECUTIVE_ATTENDANCE;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(1)
  count: number;
}

export class QuestClearContentDto {
  @ApiProperty({
    type: String,
    example: EVENT_TYPE.QUEST_CLEAR,
  })
  @IsEnum([EVENT_TYPE.QUEST_CLEAR])
  type: typeof EVENT_TYPE.QUEST_CLEAR;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(1)
  count: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(1)
  dataQuestId: number;

  @ApiProperty({
    type: String,
    example: 'AAA quest clear',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class FriendInviteContentDto {
  @ApiProperty({
    type: String,
    example: EVENT_TYPE.FRIEND_INVITE,
  })
  @IsEnum([EVENT_TYPE.FRIEND_INVITE])
  type: typeof EVENT_TYPE.FRIEND_INVITE;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsInt()
  @Min(1)
  count: number;

  @ApiProperty({
    isArray: true,
    type: String,
    example: ['123', '456'],
  })
  @IsArray()
  @IsString({ each: true })
  invitedUserIds: string[];
}

export type AllEventContentsDto =
  | AttendanceContentDto
  | ConsecutiveAttendanceContentDto
  | QuestClearContentDto
  | FriendInviteContentDto;

export const EVENT_CONTENT_DTO_LIST = [
  AttendanceContentDto,
  ConsecutiveAttendanceContentDto,
  QuestClearContentDto,
  FriendInviteContentDto,
];
