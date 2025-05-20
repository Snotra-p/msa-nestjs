import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { ROLE, Role } from '@libs/shared/auth/roles/role';

import { UserDto } from './user.dto';

export class FilterUserDto {
  @ApiPropertyOptional({
    isArray: true,
    enum: Object.values(ROLE),
  })
  @IsOptional()
  roles?: Role[] | null;
}

export class SortUserDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof UserDto;

  @ApiProperty({ enum: ['asc', 'desc'] })
  @IsEnum(['asc', 'desc'])
  order: 'asc' | 'desc';
}

export class QueryUserInDto {
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
    example: '{"roles":["ADMIN","USER"]}',
    description: 'JSON 형식의 필터 옵션',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterUserDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterUserDto)
  filters?: FilterUserDto | null;

  @ApiPropertyOptional({
    type: String,
    example: '[{"orderBy":"createdAt","order":"asc"}]',
    description: 'JSON 형식의 정렬 옵션',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  sort?: SortUserDto[] | null;
}
