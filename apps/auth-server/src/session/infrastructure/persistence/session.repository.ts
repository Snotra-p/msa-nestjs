import { NullableType } from '@libs/core/types/nullable.type';

import { User } from '../../../users/domain/user';
import { Session } from '../../domain/session';

export abstract class SessionRepository {
  abstract findById(id: Session['id']): Promise<NullableType<Session>>;

  abstract findByUserId(userId: User['id']): Promise<NullableType<Session>>;

  abstract create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session>;

  abstract update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null>;

  abstract deleteById(id: Session['id']): Promise<void>;
}
