import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  AllEventContentsClass,
  AttendanceContentSchema,
  ConsecutiveAttendanceContentSchema,
  EventContentsSchema,
  FriendInviteContentSchema,
  QuestClearContentSchema,
} from 'apps/event-server/src/events/infrastructure/persistence/entities/event-contents.schema';
import { EVENT_TYPE } from '@libs/shared/event-server/event/event-type';

export type UserEventSchemaDocument = HydratedDocument<UserEventSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserEventSchemaClass {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({
    type: EventContentsSchema,
    required: true,
  })
  contents: AllEventContentsClass;

  @Prop({ type: Date })
  completedAt: Date;
}

export const UserEventSchema =
  SchemaFactory.createForClass(UserEventSchemaClass);

UserEventSchema.path('contents').schema.discriminator(
  EVENT_TYPE.ATTENDANCE,
  AttendanceContentSchema,
  { value: EVENT_TYPE.ATTENDANCE },
);

UserEventSchema.path('contents').schema.discriminator(
  EVENT_TYPE.CONSECUTIVE_ATTENDANCE,
  ConsecutiveAttendanceContentSchema,
  { value: EVENT_TYPE.CONSECUTIVE_ATTENDANCE },
);

UserEventSchema.path('contents').schema.discriminator(
  EVENT_TYPE.QUEST_CLEAR,
  QuestClearContentSchema,
  { value: EVENT_TYPE.QUEST_CLEAR },
);

UserEventSchema.path('contents').schema.discriminator(
  EVENT_TYPE.FRIEND_INVITE,
  FriendInviteContentSchema,
  { value: EVENT_TYPE.FRIEND_INVITE },
);
