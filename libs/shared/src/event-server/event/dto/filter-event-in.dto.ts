import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

import { EVENT_TYPE, EventType } from '../event-type';

export class FilterEventInDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  activate?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startedAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endedAt?: Date;

  @ApiPropertyOptional({ enum: EVENT_TYPE })
  @IsOptional()
  @IsEnum(EVENT_TYPE)
  type?: EventType;
}
