import { NullableType } from '@libs/core/types/nullable.type';
import { IPaginationOptions } from '@libs/core/types/pagination-options';
import {
  FilterUserDto,
  SortUserDto,
} from '@libs/shared/auth-server/users/dto/query-user-in.dto';

import { User } from '../../domain/user';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]>;

  abstract count(filterOptions?: FilterUserDto | null): Promise<number>;
}
