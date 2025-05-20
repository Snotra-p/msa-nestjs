import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { CreateUserRewardsClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/create-user-rewards-claim-in.dto';
import { UserRewardsClaimsQueryInDto } from '@libs/shared/event-server/user-rewards-claims/dto/query-user-rewards-claim-in.dto';
import { UserRewardsClaimDto } from '@libs/shared/event-server/user-rewards-claims/dto/user-rewards-claim.dto';

import { UserRewardsClaimsService } from './user-rewards-claims.service';
import { UserRewardsClaim } from './domain/user-rewards-claim';

@ApiTags('UserRewardClaims')
@Controller({
  path: 'user-reward-claims',
  version: '1',
})
export class UserRewardsClaimsController {
  constructor(
    private readonly userRewardsClaimsService: UserRewardsClaimsService,
  ) {}

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
    isArray: true,
  })
  @Get('me')
  async findOne(
    @Query('userId') userId: string,
  ): Promise<ResponseEntity<UserRewardsClaim>> {
    const userRewardClaims =
      await this.userRewardsClaimsService.findOne(userId);

    return ResponseEntity.ok().body(userRewardClaims);
  }

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Query()
    query: UserRewardsClaimsQueryInDto,
  ): Promise<ResponseEntity<UserRewardsClaim[]>> {
    const [userRewardClaims, pagination] =
      await this.userRewardsClaimsService.findManyWithPagination(query);

    return ResponseEntity.ok().body(userRewardClaims).setPagination(pagination);
  }

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
  })
  @Post()
  async create(
    @Body() createUserRewardClaimDto: CreateUserRewardsClaimInDto,
  ): Promise<ResponseEntity<UserRewardsClaimDto>> {
    const userRewardClaim = await this.userRewardsClaimsService.create(
      createUserRewardClaimDto,
    );

    return ResponseEntity.code(HttpStatus.CREATED).body(userRewardClaim);
  }

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
  })
  @Patch(':id/approve')
  async approve(
    @Param('id') id: string,
  ): Promise<ResponseEntity<UserRewardsClaimDto>> {
    const userRewardClaim = await this.userRewardsClaimsService.approve(id);

    return ResponseEntity.ok().body(userRewardClaim);
  }

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
  })
  @Patch(':id/reject')
  async reject(
    @Param('id') id: string,
  ): Promise<ResponseEntity<UserRewardsClaimDto>> {
    const userRewardClaim = await this.userRewardsClaimsService.reject(id);

    return ResponseEntity.ok().body(userRewardClaim);
  }
}
