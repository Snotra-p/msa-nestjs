import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NullableType } from '@libs/core/types/nullable.type';

import { SessionSchemaClass } from '../entities/session.schema';
import { SessionMapper } from '../mappers/session.mapper';
import { SessionRepository } from '../session.repository';
import { Session } from '../../../domain/session';
import { User } from '../../../../users/domain/user';

@Injectable()
export class SessionDocumentRepository implements SessionRepository {
  constructor(
    @InjectModel(SessionSchemaClass.name)
    private sessionModel: Model<SessionSchemaClass>,
  ) {}

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const sessionObject = await this.sessionModel.findById(id);
    return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
  }

  async findByUserId(userId: User['id']): Promise<NullableType<Session>> {
    const sessionObject = await this.sessionModel.findOne({
      user: userId,
    });

    return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
  }

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    const createdSession = new this.sessionModel(persistenceModel);
    const sessionObject = await createdSession.save();
    return SessionMapper.toDomain(sessionObject);
  }

  async update(
    id: Session['id'],
    payload: Partial<Session>,
  ): Promise<Session | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;
    delete clonedPayload.createdAt;
    delete clonedPayload.updatedAt;
    delete clonedPayload.deletedAt;

    const filter = { _id: id };
    const session = await this.sessionModel.findOne(filter);

    if (!session) {
      return null;
    }

    const sessionObject = await this.sessionModel.findOneAndUpdate(
      filter,
      SessionMapper.toPersistence({
        ...SessionMapper.toDomain(session),
        ...clonedPayload,
      }),
      { new: true },
    );

    return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
  }

  async deleteById(id: Session['id']): Promise<void> {
    await this.sessionModel.deleteOne({ _id: id.toString() });
  }
}
