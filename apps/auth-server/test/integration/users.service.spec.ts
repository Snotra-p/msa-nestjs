import { setGlobalErrorMap } from '@libs/core/utils/setup-error';
import { Test, TestingModule } from '@nestjs/testing';
import { ROLE } from '@libs/shared/auth/roles/role';
import { CreateUserInDto } from '@libs/shared/auth-server/users/dto/create-user-in.dto';
import { QueryUserInDto } from '@libs/shared/auth-server/users/dto/query-user-in.dto';

import { AuthServerModule } from '../../../auth-server/src/auth-server.module';
import { UsersService } from '../../../auth-server/src/users/users.service';
import {
  AUTH_SERVER_ERROR,
  AUTH_SERVER_ERROR_KEY,
} from '../../../auth-server/src/error/auth-server-error';

describe('UsersService Integration Test', () => {
  let service: UsersService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    setGlobalErrorMap(AUTH_SERVER_ERROR);
    moduleRef = await Test.createTestingModule({
      imports: [AuthServerModule],
      exports: [AuthServerModule],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('create', () => {
    it('새로운 사용자를 생성할 수 있어야 한다', async () => {
      const createUserDto: CreateUserInDto = {
        email: 'test@example.com',
        password: 'password123',
        role: ROLE.USER,
      };

      const user = await service.create(createUserDto);

      expect(user).toBeDefined();
      expect(user.email).toBe(createUserDto.email);
      expect(user.role).toBe(createUserDto.role);
      expect(user.password).not.toBe(createUserDto.password); // 비밀번호가 해시되었는지 확인
    });

    it('이미 존재하는 이메일로 사용자 생성 시 에러가 발생해야 한다', async () => {
      const createUserDto: CreateUserInDto = {
        email: 'duplicate@example.com',
        password: 'password123',
        role: ROLE.USER,
      };

      await service.create(createUserDto);

      await expect(service.create(createUserDto)).rejects.toThrow(
        AUTH_SERVER_ERROR_KEY.USER_ALREADY_EXISTS,
      );
    });
  });

  describe('findManyWithPagination', () => {
    beforeEach(async () => {
      // 테스트 데이터 생성
      const users: CreateUserInDto[] = [
        {
          email: 'user1@example.com',
          password: 'password123',
          role: ROLE.USER,
        },
        {
          email: 'user2@example.com',
          password: 'password123',
          role: ROLE.ADMIN,
        },
        {
          email: 'user3@example.com',
          password: 'password123',
          role: ROLE.USER,
        },
      ];

      for (const user of users) {
        await service.create(user);
      }
    });

    it('페이지네이션된 사용자 목록을 조회할 수 있어야 한다', async () => {
      const query: QueryUserInDto = {
        page: 1,
        limit: 2,
      };

      const [users] = await service.findManyWithPagination(query);

      expect(users).toHaveLength(2);
    });

    it('역할별로 사용자를 필터링할 수 있어야 한다', async () => {
      const query: QueryUserInDto = {
        page: 1,
        limit: 10,
        filters: {
          roles: [ROLE.USER],
        },
      };

      const [users] = await service.findManyWithPagination(query);

      expect(users.every((user) => user.role === ROLE.USER)).toBe(true);
    });
  });
});
