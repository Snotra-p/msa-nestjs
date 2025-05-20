import { Injectable } from '@nestjs/common';
import { CreateEventInDto } from '@libs/shared/event-server/event/dto/create-event-in.dto';
import { PaginationOutDto } from '@libs/core/dto/pagination/pagination-out.dto';
import { FilterEventInDto } from '@libs/shared/event-server/event/dto/filter-event-in.dto';
import { SortEventInDto } from '@libs/shared/event-server/event/dto/sort-event-in.dto';
import { EventDto } from '@libs/shared/event-server/event/dto/event.dto';

import { EventRepository } from './infrastructure/persistence/event.repository';
import { Event } from './domain/event';
@Injectable()
export class EventsService {
  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(dto: CreateEventInDto) {
    const event = await this.eventRepository.create(dto);
    return EventDto.fromEntity(event);
  }

  async findManyWithPagination(options: {
    filterOptions?: FilterEventInDto;
    sortOptions?: SortEventInDto[];
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<[EventDto[], PaginationOutDto]> {
    const [events, pagination] =
      await this.eventRepository.findManyWithPagination(options);
    return [EventDto.fromEntities(events), pagination];
  }
}
