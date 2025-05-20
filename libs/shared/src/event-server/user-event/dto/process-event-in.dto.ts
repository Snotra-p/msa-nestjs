import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { EVENT_TYPE, EventType } from '../../event/event-type';

export class ProcessEventInDto {
  @ApiProperty()
  @IsEnum(EVENT_TYPE)
  @IsNotEmpty()
  eventType: EventType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  count?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  value?: number;
}
