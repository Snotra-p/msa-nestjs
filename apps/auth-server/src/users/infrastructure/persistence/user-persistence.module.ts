import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema, UserSchemaClass } from './entities/user.schema';
import { UserRepository } from './user.repository';
import { UsersMongooseRepository } from './repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchemaClass.name, schema: UserSchema },
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UsersMongooseRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserPersistenceModule {}
