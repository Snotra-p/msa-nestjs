import { Transform, plainToInstance, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';

import { FilterUserRewardsClaimInDto } from './filter-user-rewards-claim-in.dto';
import { SortUserRewardClaimInDto } from './sort-user-reward-claim-in.dto';

export class UserRewardsClaimsQueryInDto {
  @ApiPropertyOptional({
    type: String,
    example: '{"userId":"1234567890"}',
    description: 'JSON 형식의 필터 옵션',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? plainToInstance(FilterUserRewardsClaimInDto, JSON.parse(value))
      : undefined,
  )
  @ValidateNested()
  @Type(() => FilterUserRewardsClaimInDto)
  filters?: FilterUserRewardsClaimInDto;

  @ApiPropertyOptional({
    type: String,
    example: '[{"orderBy":"createdAt","order":"asc"}]',
    description: 'JSON 형식의 정렬 옵션',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value
      ? plainToInstance(SortUserRewardClaimInDto, JSON.parse(value))
      : undefined,
  )
  @ValidateNested({ each: true })
  @Type(() => SortUserRewardClaimInDto)
  sort?: SortUserRewardClaimInDto[];

  @ApiPropertyOptional({
    type: Number,
    example: 1,
    description: '페이지 번호',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
    description: '페이지 당 항목 수',
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number;
}
