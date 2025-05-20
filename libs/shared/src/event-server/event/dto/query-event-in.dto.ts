import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, ValidateNested } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

import { FilterEventInDto } from './filter-event-in.dto';
import { SortEventInDto } from './sort-event-in.dto';

export class QueryEventInDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({
    type: String,
    example: '{"activate":true,"type":"attendance"}',
    description: 'JSON 형식의 필터 옵션',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterEventInDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterEventInDto)
  filters?: FilterEventInDto;

  @ApiPropertyOptional({
    type: String,
    example: '[{"orderBy":"createdAt","order":"asc"}]',
    description: 'JSON 형식의 정렬 옵션',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(SortEventInDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested({ each: true })
  @Type(() => SortEventInDto)
  sort?: SortEventInDto[];
}
