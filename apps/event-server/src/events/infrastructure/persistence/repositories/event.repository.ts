import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NullableType } from '@libs/core/types/nullable.type';
import { PaginationOutDto } from '@libs/core/dto/pagination/pagination-out.dto';
import { FilterEventInDto } from '@libs/shared/event-server/event/dto/filter-event-in.dto';
import { SortEventInDto } from '@libs/shared/event-server/event/dto/sort-event-in.dto';
import { EventType } from '@libs/shared/event-server/event/event-type';

import { EventRepository } from '../event.repository';
import { Event } from '../../../domain/event';
import { EventMapper } from '../mappers/event-mapper';
import { EventSchemaClass } from '../entities/event.schema';

export class EventMongooseRepository implements EventRepository {
  constructor(
    @InjectModel(EventSchemaClass.name)
    private eventModel: Model<EventSchemaClass>,
  ) {}

  async create(
    data: Omit<Event, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Event> {
    const event = await this.eventModel.create(data);
    return EventMapper.toDomain(event);
  }

  async findById(id: Event['id']): Promise<NullableType<Event>> {
    const event = await this.eventModel.findById(id);
    return event ? EventMapper.toDomain(event) : null;
  }

  async findManyWithPagination(options: {
    filterOptions?: FilterEventInDto;
    sortOptions?: SortEventInDto[];
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<[Event[], PaginationOutDto]> {
    const { filterOptions, sortOptions, paginationOptions } = options;
    const { page, limit } = paginationOptions;

    const query = this.eventModel.find();

    // 필터 옵션 적용
    if (filterOptions?.userId) {
      query.where('userId').equals(filterOptions.userId);
    }
    if (filterOptions?.activate !== undefined) {
      query.where('activate').equals(filterOptions.activate);
    }
    if (filterOptions?.startedAt) {
      query.where('startedAt').gte(filterOptions.startedAt.getTime());
    }
    if (filterOptions?.endedAt) {
      query.where('endedAt').lte(filterOptions.endedAt.getTime());
    }
    if (filterOptions?.type) {
      query.where('contents').elemMatch({ type: filterOptions.type });
    }

    if (sortOptions) {
      sortOptions.forEach((sortOption) => {
        query.sort({ [sortOption.orderBy]: sortOption.order });
      });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    const [events, total] = await Promise.all([
      query.exec(),
      this.eventModel.countDocuments(query.getQuery()),
    ]);

    const pagination = new PaginationOutDto({
      page,
      size: limit,
      totalElements: total,
      totalPages: Math.ceil(total / limit),
    });

    return [events.map((event) => EventMapper.toDomain(event)), pagination];
  }

  async findByTypeAndDateAndActive(
    type: EventType,
    date: Date,
  ): Promise<NullableType<Event[]>> {
    const events = await this.eventModel.find({
      $and: [
        { startedAt: { $lte: date } },
        { endedAt: { $gte: date } },
        { activate: true },
        { 'contents.type': type },
      ],
    });
    return events ? events.map((event) => EventMapper.toDomain(event)) : null;
  }
}
