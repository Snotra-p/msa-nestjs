import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, HydratedDocument } from 'mongoose';

import { UserSchemaClass } from '../../../../users/infrastructure/persistence/entities/user.schema';

export type SessionSchemaDocument = HydratedDocument<SessionSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class SessionSchemaClass {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchemaClass',
    index: 1,
  })
  user: UserSchemaClass;

  @Prop()
  hash: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop({ default: null, type: Date })
  deletedAt: Date | null;
}

export const SessionSchema = SchemaFactory.createForClass(SessionSchemaClass);
