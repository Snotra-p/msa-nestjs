import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { CreateUserRewardsClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/create-user-rewards-claim-in.dto';
import { UserRewardsClaimDto } from '@libs/shared/event-server/user-rewards-claims/dto/user-rewards-claim.dto';
import { UserRewardsClaimsQueryInDto } from '@libs/shared/event-server/user-rewards-claims/dto/query-user-rewards-claim-in.dto';
import { ROLE } from '@libs/shared/auth/roles/role';
import { AuthGuard } from '@nestjs/passport';

import { EventGatewayUserRewardsClaimsService } from './event-gateway-user-rewards-claims.service';
import { RolesGuard } from '../../auth/guard/role.guard';
import { PASSPORT_STRATEGY } from '../../auth/strategies/constant/passport.constant';
import { Roles } from '../../auth/decorator/roles';
import { TokenPayload } from '../../auth/strategies/decorator/token-payload.decorator';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

@ApiTags('Event Gateway User Rewards Claims')
@Controller('event-gateway/user-reward-claims')
export class EventGatewayUserRewardsClaimsController {
  constructor(
    private readonly eventGatewayUserRewardsClaimsService: EventGatewayUserRewardsClaimsService,
  ) {}

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
    isArray: true,
  })
  @Roles([ROLE.AUDITOR])
  @ApiBearerAuth()
  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_STRATEGY), RolesGuard)
  @Get()
  async findAll(
    @Query() query: UserRewardsClaimsQueryInDto,
  ): Promise<ResponseEntity<UserRewardsClaimDto[]>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return this.eventGatewayUserRewardsClaimsService.findManyWithPagination({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
  })
  @Roles([ROLE.USER])
  @ApiBearerAuth()
  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_STRATEGY), RolesGuard)
  @Get('me')
  async findOne(
    @TokenPayload() payload: JwtPayloadType,
  ): Promise<ResponseEntity<UserRewardsClaimDto>> {
    return this.eventGatewayUserRewardsClaimsService.findOne(payload.id);
  }

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
  })
  @Roles([ROLE.USER])
  @ApiBearerAuth()
  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_STRATEGY), RolesGuard)
  @Post()
  async create(
    @Body() dto: CreateUserRewardsClaimInDto,
  ): Promise<ResponseEntity<UserRewardsClaimDto>> {
    return this.eventGatewayUserRewardsClaimsService.create(dto);
  }

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
  })
  @Roles([ROLE.AUDITOR])
  @ApiBearerAuth()
  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_STRATEGY), RolesGuard)
  @Patch(':id/approve')
  async approve(
    @Param('id') id: string,
  ): Promise<ResponseEntity<UserRewardsClaimDto>> {
    return await this.eventGatewayUserRewardsClaimsService.approve(id);
  }

  @ApiResponseDocs({
    type: UserRewardsClaimDto,
  })
  @Roles([ROLE.AUDITOR])
  @ApiBearerAuth()
  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_STRATEGY), RolesGuard)
  @Patch(':id/reject')
  async reject(
    @Param('id') id: string,
  ): Promise<ResponseEntity<UserRewardsClaimDto>> {
    return await this.eventGatewayUserRewardsClaimsService.reject(id);
  }
}
