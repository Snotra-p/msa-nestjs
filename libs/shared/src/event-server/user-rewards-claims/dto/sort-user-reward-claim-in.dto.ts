import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class SortUserRewardClaimInDto {
  @ApiProperty()
  @IsString()
  orderBy: string;

  @ApiProperty({ enum: ['asc', 'desc'] })
  @IsEnum(['asc', 'desc'])
  order: 'asc' | 'desc';
}
