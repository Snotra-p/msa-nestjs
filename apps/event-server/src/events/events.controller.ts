import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { CreateEventInDto } from '@libs/shared/event-server/event/dto/create-event-in.dto';
import { QueryEventInDto } from '@libs/shared/event-server/event/dto/query-event-in.dto';
import { EventDto } from '@libs/shared/event-server/event/dto/event.dto';

import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiResponseDocs({
    type: EventDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Query() query: QueryEventInDto,
  ): Promise<ResponseEntity<EventDto[]>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    const [events, pagination] =
      await this.eventsService.findManyWithPagination({
        filterOptions: query?.filters,
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
      });

    return ResponseEntity.ok().body(events).setPagination(pagination);
  }

  @ApiResponseDocs({
    type: EventDto,
  })
  @Post()
  async createEvent(@Body() dto: CreateEventInDto) {
    const event = await this.eventsService.createEvent(dto);
    return ResponseEntity.code(HttpStatus.CREATED).body(event);
  }
}
