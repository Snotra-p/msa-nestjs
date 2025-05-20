import { Injectable } from '@nestjs/common';
import { NullableType } from '@libs/core/types/nullable.type';

import { SessionRepository } from './infrastructure/persistence/session.repository';
import { Session } from './domain/session';
import { User } from '../users/domain/user';

@Injectable()
export class SessionProvider {
  constructor(private readonly sessionRepository: SessionRepository) {}

  findById(id: Session['id']): Promise<NullableType<Session>> {
    return this.sessionRepository.findById(id);
  }

  findByUserId(userId: User['id']): Promise<NullableType<Session>> {
    return this.sessionRepository.findByUserId(userId);
  }

  create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    return this.sessionRepository.update(id, payload);
  }

  deleteById(id: Session['id']): Promise<void> {
    return this.sessionRepository.deleteById(id);
  }
}
