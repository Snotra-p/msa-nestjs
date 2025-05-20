import bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { PaginationOutDto } from '@libs/core/dto/pagination/pagination-out.dto';
import { UserDto } from '@libs/shared/auth-server/users/dto/user.dto';
import { CreateUserInDto } from '@libs/shared/auth-server/users/dto/create-user-in.dto';
import { QueryUserInDto } from '@libs/shared/auth-server/users/dto/query-user-in.dto';

import { UserRepository } from './infrastructure/persistence/user.repository';
import { AuthServerException } from '../error/auth-server-exception';
import { AUTH_SERVER_ERROR_KEY } from '../error/auth-server-error';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  async create(createUserDto: CreateUserInDto): Promise<UserDto> {
    const { email, password, role } = createUserDto;

    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new AuthServerException(AUTH_SERVER_ERROR_KEY.USER_ALREADY_EXISTS);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return UserDto.fromEntity(
      this.usersRepository.create({
        email: email,
        password: hashedPassword,
        role: role,
      }),
    );
  }

  async findManyWithPagination(
    query: QueryUserInDto,
  ): Promise<[UserDto[], PaginationOutDto]> {
    const { filters, sort, page = 1, limit = 10 } = query;
    const users = await this.usersRepository.findManyWithPagination({
      filterOptions: filters,
      sortOptions: sort,
      paginationOptions: {
        page: page ?? 1,
        limit: limit ?? 10,
      },
    });

    const totalCount = await this.usersRepository.count(filters);

    return [
      UserDto.fromEntities(users),
      new PaginationOutDto({
        totalElements: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        page: page,
        size: limit,
      }),
    ];
  }
}
