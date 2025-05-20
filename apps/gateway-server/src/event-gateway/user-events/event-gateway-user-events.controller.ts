import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { ProcessEventInDto } from '@libs/shared/event-server/user-event/dto/process-event-in.dto';
import { UserEventDto } from '@libs/shared/event-server/user-event/dto/user-event.dto';
import { AuthGuard } from '@nestjs/passport';

import { EventGatewayUserEventsService } from './event-gateway-user-events.service';
import { PASSPORT_STRATEGY } from '../../auth/strategies/constant/passport.constant';
import { TokenPayload } from '../../auth/strategies/decorator/token-payload.decorator';
import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';

@ApiTags('Event Gateway User Events')
@Controller('event-gateway/user-events')
export class EventGatewayUserEventsController {
  constructor(
    private readonly eventGatewayUserEventsService: EventGatewayUserEventsService,
  ) {}

  @ApiResponseDocs({
    type: UserEventDto,
    isArray: true,
  })
  @Get()
  async getUserEvents(): Promise<ResponseEntity<UserEventDto[]>> {
    return this.eventGatewayUserEventsService.getUserEvents();
  }

  @ApiResponseDocs({
    type: UserEventDto,
    isArray: true,
    summary: '이벤트 처리(조건 저장)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(PASSPORT_STRATEGY.JWT_STRATEGY))
  @Post('process')
  async processEvent(
    @Body() dto: ProcessEventInDto,
    @TokenPayload() payload: JwtPayloadType,
  ): Promise<ResponseEntity<UserEventDto[]>> {
    return this.eventGatewayUserEventsService.processEvent({
      ...dto,
      userId: payload.id,
    });
  }
}
