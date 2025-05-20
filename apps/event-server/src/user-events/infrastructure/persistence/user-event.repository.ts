import { NullableType } from '@libs/core/types/nullable.type';
import { PaginationOutDto } from '@libs/core/dto/pagination/pagination-out.dto';

import { UserEvent } from '../../domain/user-event';
export abstract class UserEventRepository {
  abstract create(data: Omit<UserEvent, 'id'>): Promise<UserEvent>;

  abstract createMany(data: Omit<UserEvent, 'id'>[]): Promise<UserEvent[]>;

  abstract updateMany(data: UserEvent[]): Promise<UserEvent[]>;

  abstract find(): Promise<UserEvent[]>;

  abstract findById(id: UserEvent['id']): Promise<NullableType<UserEvent>>;

  abstract findByEventIds(eventIds: string[]): Promise<UserEvent[]>;

  abstract findByEventId(eventId: string): Promise<NullableType<UserEvent>>;

  abstract findManyWithPagination(options: {
    filterOptions?: {
      eventId?: string;
      type?: string;
    };
    sortOptions?: {
      orderBy: string;
      order: 'asc' | 'desc';
    }[];
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<[UserEvent[], PaginationOutDto]>;

  abstract findByUserIdAndEventId(
    userId: string,
    eventId: string,
  ): Promise<UserEvent[]>;
}
