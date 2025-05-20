import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NullableType } from '@libs/core/types/nullable.type';
import { PaginationOutDto } from '@libs/core/dto/pagination/pagination-out.dto';

import { UserEventRepository } from '../user-event.repository';
import { UserEvent } from '../../../domain/user-event';
import { UserEventMapper } from '../mappers/user-event-mapper';
import { UserEventSchemaClass } from '../entities/user-event.schema';

export class UserEventMongooseRepository implements UserEventRepository {
  constructor(
    @InjectModel(UserEventSchemaClass.name)
    private userEventModel: Model<UserEventSchemaClass>,
  ) {}

  async create(data: Omit<UserEvent, 'id'>): Promise<UserEvent> {
    const userEvent = await this.userEventModel.create(data);
    return UserEventMapper.toDomain(userEvent);
  }

  async createMany(data: Omit<UserEvent, 'id'>[]): Promise<UserEvent[]> {
    const userEvents = await this.userEventModel.create(data);
    return userEvents.map((userEvent) => UserEventMapper.toDomain(userEvent));
  }

  async updateMany(data: UserEvent[]): Promise<UserEvent[]> {
    const bulkOps = data.map((userEvent) => {
      // _id 또는 다른 필드로 문서 식별
      const filter = { _id: new Types.ObjectId(userEvent.id) };

      // id 필드 제외하고 업데이트할 데이터 준비
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
      const { id, ...updateData } = userEvent;

      return {
        updateOne: {
          filter,
          update: { $set: updateData },
        },
      };
    });

    await this.userEventModel.bulkWrite(bulkOps);

    // 업데이트된 문서 조회
    const updatedDocs = await this.userEventModel.find({
      _id: { $in: data.map((item) => new Types.ObjectId(item.id)) },
    });

    return updatedDocs.map((doc) => UserEventMapper.toDomain(doc));
  }

  async find(): Promise<UserEvent[]> {
    const userEvents = await this.userEventModel.find();
    return userEvents.map((userEvent) => UserEventMapper.toDomain(userEvent));
  }

  async findById(id: UserEvent['id']): Promise<NullableType<UserEvent>> {
    const userEvent = await this.userEventModel.findById(id);
    return userEvent ? UserEventMapper.toDomain(userEvent) : null;
  }

  async findByEventIds(eventIds: string[]): Promise<UserEvent[]> {
    const userEvents = await this.userEventModel.find({
      eventId: { $in: eventIds },
    });
    return userEvents.map((userEvent) => UserEventMapper.toDomain(userEvent));
  }

  async findByEventId(eventId: string): Promise<NullableType<UserEvent>> {
    const userEvent = await this.userEventModel.findOne({
      eventId,
    });
    return userEvent ? UserEventMapper.toDomain(userEvent) : null;
  }

  async findManyWithPagination(options: {
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
  }): Promise<[UserEvent[], PaginationOutDto]> {
    const { filterOptions, sortOptions, paginationOptions } = options;
    const { page, limit } = paginationOptions;

    const query = this.userEventModel.find();

    // 필터 옵션 적용
    if (filterOptions?.eventId) {
      query.where('eventId').equals(filterOptions.eventId);
    }
    if (filterOptions?.type) {
      query.where('type').equals(filterOptions.type);
    }

    // 정렬 옵션 적용
    if (sortOptions) {
      sortOptions.forEach((sortOption) => {
        query.sort({ [sortOption.orderBy]: sortOption.order });
      });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    const [userEvents, total] = await Promise.all([
      query.exec(),
      this.userEventModel.countDocuments(query.getQuery()),
    ]);

    const pagination = new PaginationOutDto({
      page,
      size: limit,
      totalElements: total,
      totalPages: Math.ceil(total / limit),
    });

    return [
      userEvents.map((event) => UserEventMapper.toDomain(event)),
      pagination,
    ];
  }

  async findByUserIdAndEventId(
    userId: string,
    eventId: string,
  ): Promise<UserEvent[]> {
    const userEvents = await this.userEventModel.find({
      userId,
      eventId,
    });
    return userEvents.map((userEvent) => UserEventMapper.toDomain(userEvent));
  }
}
