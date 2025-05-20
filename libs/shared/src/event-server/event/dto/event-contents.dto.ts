import {
  IsArray,
  IsNotEmpty,
  IsString,
  Min,
  IsInt,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseOutDto } from '@libs/core/dto/base-out.dto';

import { EVENT_TYPE, EventType } from '../event-type';

export class EventContentsDto extends BaseOutDto {
  @ApiProperty({ enum: EVENT_TYPE })
  type: EventType;

  @ApiProperty()
  count: number;
}

export class AttendanceContentDto {
  @IsEnum([EVENT_TYPE.ATTENDANCE])
  type: typeof EVENT_TYPE.ATTENDANCE;

  @IsInt()
  @Min(1)
  count: number;
}

export class ConsecutiveAttendanceContentDto {
  @IsEnum([EVENT_TYPE.CONSECUTIVE_ATTENDANCE])
  type: typeof EVENT_TYPE.CONSECUTIVE_ATTENDANCE;

  @IsInt()
  @Min(1)
  count: number;
}

export class QuestClearContentDto {
  @IsEnum([EVENT_TYPE.QUEST_CLEAR])
  type: typeof EVENT_TYPE.QUEST_CLEAR;

  @IsInt()
  @Min(1)
  count: number;

  @IsInt()
  @Min(1)
  dataQuestId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class FriendInviteContentDto {
  @IsEnum([EVENT_TYPE.FRIEND_INVITE])
  type: typeof EVENT_TYPE.FRIEND_INVITE;

  @IsInt()
  @Min(1)
  count: number;

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
