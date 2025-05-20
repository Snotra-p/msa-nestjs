import { Controller, Post, Body, Query, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { QueryUserInDto } from '@libs/shared/auth-server/users/dto/query-user-in.dto';
import { UserDto } from '@libs/shared/auth-server/users/dto/user.dto';
import { CreateUserInDto } from '@libs/shared/auth-server/users/dto/create-user-in.dto';

import { UsersService } from './users.service';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponseDocs({
    type: UserDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Query() query: QueryUserInDto,
  ): Promise<ResponseEntity<UserDto[]>> {
    const [users, pagination] =
      await this.usersService.findManyWithPagination(query);

    return ResponseEntity.ok().body(users).setPagination(pagination);
  }

  @ApiResponseDocs({
    type: UserDto,
  })
  @Post()
  async create(
    @Body() createProfileDto: CreateUserInDto,
  ): Promise<ResponseEntity<UserDto>> {
    const userDto = await this.usersService.create(createProfileDto);
    return ResponseEntity.code(HttpStatus.CREATED).body(userDto);
  }
}
