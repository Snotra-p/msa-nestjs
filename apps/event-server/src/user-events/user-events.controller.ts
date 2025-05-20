import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { ProcessEventInDto } from '@libs/shared/event-server/user-event/dto/process-event-in.dto';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { UserEventDto } from '@libs/shared/event-server/user-event/dto/user-event.dto';

import { UserEventsService } from './user-events.service';

@ApiTags('User Events')
@Controller({
  path: 'user-events',
  version: '1',
})
export class UserEventsController {
  constructor(private readonly userEventsService: UserEventsService) {}

  @ApiResponseDocs({
    type: UserEventDto,
    isArray: true,
  })
  @Get('')
  async getUserEvents(): Promise<ResponseEntity<UserEventDto[]>> {
    const userEvents = await this.userEventsService.getUserEvents();

    return ResponseEntity.ok().body(userEvents);
  }

  @ApiResponseDocs({
    type: UserEventDto,
    isArray: true,
    summary: '이벤트 처리(조건 저장)',
  })
  @Post('process')
  async processEvent(
    @Body() dto: ProcessEventInDto,
  ): Promise<ResponseEntity<UserEventDto[]>> {
    const userEvents = await this.userEventsService.processEvent(dto);

    return ResponseEntity.ok().body(userEvents);
  }
}
