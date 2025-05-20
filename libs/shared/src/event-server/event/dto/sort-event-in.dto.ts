import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

import { EventDto } from './event.dto';

export class SortEventInDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof EventDto;

  @ApiProperty({ enum: ['asc', 'desc'] })
  @IsEnum(['asc', 'desc'])
  order: 'asc' | 'desc';
}
