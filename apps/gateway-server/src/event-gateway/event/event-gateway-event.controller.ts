import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { CreateEventInDto } from '@libs/shared/event-server/event/dto/create-event-in.dto';
import { QueryEventInDto } from '@libs/shared/event-server/event/dto/query-event-in.dto';
import { EventDto } from '@libs/shared/event-server/event/dto/event.dto';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from '@libs/shared/auth/roles/role';

import { EventGatewayEventService } from './event-gateway-event.service';
import { PASSPORT_STRATEGY } from '../../auth/strategies/constant/passport.constant';
import { RolesGuard } from '../../auth/guard/role.guard';
import { Roles } from '../../auth/decorator/roles';
@ApiTags('Event Gateway Events')
@Controller('event-gateway/event')
export class EventGatewayEventController {
  constructor(
    private readonly eventGatewayEventService: EventGatewayEventService,
  ) {}

  @ApiResponseDocs({
    type: EventDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Query() query: QueryEventInDto,
  ): Promise<ResponseEntity<EventDto[]>> {
    return this.eventGatewayEventService.findAll(query);
  }
  @Roles([ROLE.OPERATOR])
  @ApiBearerAuth()
  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_STRATEGY), RolesGuard)
  @ApiResponseDocs({
    type: EventDto,
  })
  @Post()
  async createEvent(
    @Body() dto: CreateEventInDto,
  ): Promise<ResponseEntity<EventDto>> {
    return this.eventGatewayEventService.createEvent(dto);
  }
}
