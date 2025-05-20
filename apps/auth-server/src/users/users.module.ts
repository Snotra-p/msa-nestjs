import {
  // common
  Module,
} from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserPersistenceModule } from './infrastructure/persistence/user-persistence.module';

@Module({
  imports: [UserPersistenceModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UserPersistenceModule],
})
export class UsersModule {}
