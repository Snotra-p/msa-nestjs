import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserRewardsClaimInDto {
  @ApiProperty({
    description: '유저 아이디',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
