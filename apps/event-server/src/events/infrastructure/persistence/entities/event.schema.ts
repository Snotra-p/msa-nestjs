import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';
import { EVENT_TYPE } from '@libs/shared/event-server/event/event-type';

import {
  AllEventContentsClass,
  AttendanceContentSchema,
  ConsecutiveAttendanceContentSchema,
  EventContentsSchema,
  FriendInviteContentSchema,
  QuestClearContentSchema,
} from './event-contents.schema';

export type EventSchemaDocument = HydratedDocument<EventSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class EventSchemaClass {
  _id: string | Types.ObjectId;

  @Prop({
    type: [EventContentsSchema],
    required: true,
    default: [],
    validate: {
      validator: function (contents: AllEventContentsClass[]) {
        if (!contents || contents.length <= 1) return true;

        const types = contents.map((content) => content.type);
        const uniqueTypesCount = new Set(types).size;

        return uniqueTypesCount === contents.length;
      },
      message: '같은 타입의 조건 2개가 나올수 없음.',
    },
  })
  contents: AllEventContentsClass[];

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Date, required: true })
  startedAt: Date;

  @Prop({ type: Date, required: true })
  endedAt: Date;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Boolean, required: true, default: false })
  requireApproval: boolean;

  @Prop({ type: Boolean, default: false })
  activate: boolean;

  @Prop({ type: Number, default: 1 })
  schemaVersion: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}
export const EventSchema = SchemaFactory.createForClass(EventSchemaClass);

EventSchema.index({ userId: 1 });
EventSchema.index({ startedAt: 1, endedAt: 1 });
EventSchema.index({ 'contents.type': 1 }); // 특정 이벤트 타입 조회 성능 향상

EventSchema.path('contents').schema.discriminator(
  EVENT_TYPE.ATTENDANCE,
  AttendanceContentSchema,
  { value: EVENT_TYPE.ATTENDANCE },
);

EventSchema.path('contents').schema.discriminator(
  EVENT_TYPE.CONSECUTIVE_ATTENDANCE,
  ConsecutiveAttendanceContentSchema,
  { value: EVENT_TYPE.CONSECUTIVE_ATTENDANCE },
);

EventSchema.path('contents').schema.discriminator(
  EVENT_TYPE.QUEST_CLEAR,
  QuestClearContentSchema,
  { value: EVENT_TYPE.QUEST_CLEAR },
);

EventSchema.path('contents').schema.discriminator(
  EVENT_TYPE.FRIEND_INVITE,
  FriendInviteContentSchema,
  { value: EVENT_TYPE.FRIEND_INVITE },
);
