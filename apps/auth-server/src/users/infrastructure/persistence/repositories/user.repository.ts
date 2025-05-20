import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { NullableType } from '@libs/core/types/nullable.type';
import { IPaginationOptions } from '@libs/core/types/pagination-options';
import {
  FilterUserDto,
  SortUserDto,
} from '@libs/shared/auth-server/users/dto/query-user-in.dto';

import { User } from '../../../domain/user';
import { UserRepository } from '../user.repository';
import { UserSchemaClass } from '../entities/user.schema';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersMongooseRepository implements UserRepository {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly usersModel: Model<UserSchemaClass>,
  ) {}

  getModel() {
    return this.usersModel;
  }

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const createdUser = new this.usersModel(persistenceModel);
    const userObject = await createdUser.save();
    return UserMapper.toDomain(userObject);
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const userObject = await this.usersModel.findById(id);
    return userObject ? UserMapper.toDomain(userObject) : null;
  }

  async findByEmail(email: User['email']): Promise<NullableType<User>> {
    if (!email) return null;

    const userObject = await this.usersModel.findOne({ email });
    return userObject ? UserMapper.toDomain(userObject) : null;
  }

  async count(filterOptions?: FilterUserDto | null): Promise<number> {
    const where: FilterQuery<UserSchemaClass> = {};
    if (filterOptions?.roles?.length) {
      where['role'] = {
        $in: filterOptions.roles.map((role) => role.toString()),
      };
    }
    return this.usersModel.countDocuments(where);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    const where: FilterQuery<UserSchemaClass> = {};
    if (filterOptions?.roles?.length) {
      where['role'] = {
        $in: filterOptions.roles.map((role) => role.toString()),
      };
    }

    const userObjects = await this.usersModel
      .find(where)
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === 'id' ? '_id' : sort.orderBy]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return userObjects.map((userObject) => UserMapper.toDomain(userObject));
  }
}
