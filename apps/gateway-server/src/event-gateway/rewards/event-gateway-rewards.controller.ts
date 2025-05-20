import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { CreateRewardsInDto } from '@libs/shared/event-server/rewards/dto/create-rewards-in.dto';
import { RewardsDto } from '@libs/shared/event-server/rewards/dto/rewards.dto';
import { ROLE } from '@libs/shared/auth/roles/role';
import { AuthGuard } from '@nestjs/passport';

import { EventGatewayRewardsService } from './event-gateway-rewards.service';
import { RolesGuard } from '../../auth/guard/role.guard';
import { Roles } from '../../auth/decorator/roles';
import { PASSPORT_STRATEGY } from '../../auth/strategies/constant/passport.constant';

@ApiTags('Event Gateway Rewards')
@Controller('event-gateway/rewards')
export class EventGatewayRewardsController {
  constructor(
    private readonly eventGatewayRewardsService: EventGatewayRewardsService,
  ) {}

  @ApiResponseDocs({
    type: RewardsDto,
  })
  @Roles([ROLE.OPERATOR])
  @ApiBearerAuth()
  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_STRATEGY), RolesGuard)
  @Post()
  async create(
    @Body() dto: CreateRewardsInDto,
  ): Promise<ResponseEntity<RewardsDto>> {
    return this.eventGatewayRewardsService.create(dto);
  }

  @ApiResponseDocs({
    type: RewardsDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<ResponseEntity<RewardsDto[]>> {
    return this.eventGatewayRewardsService.findAll();
  }
}
