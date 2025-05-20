import { NullableType } from '@libs/core/types/nullable.type';
import { PaginationOutDto } from '@libs/core/dto/pagination/pagination-out.dto';
import { FilterEventInDto } from '@libs/shared/event-server/event/dto/filter-event-in.dto';
import { SortEventInDto } from '@libs/shared/event-server/event/dto/sort-event-in.dto';
import { EventType } from '@libs/shared/event-server/event/event-type';

import { Event } from '../../domain/event';

export abstract class EventRepository {
  abstract create(
    data: Omit<Event, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Event>;

  abstract findById(id: Event['id']): Promise<NullableType<Event>>;

  abstract findManyWithPagination(options: {
    filterOptions?: FilterEventInDto;
    sortOptions?: SortEventInDto[];
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<[Event[], PaginationOutDto]>;

  abstract findByTypeAndDateAndActive(
    type: EventType,
    date: Date,
  ): Promise<NullableType<Event[]>>;
}
