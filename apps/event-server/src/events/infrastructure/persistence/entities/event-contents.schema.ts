import {
  EVENT_TYPE,
  EventType,
} from '@libs/shared/event-server/event/event-type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false, discriminatorKey: 'type' })
export class EventContents {
  @Prop({ required: true, enum: Object.values(EVENT_TYPE) })
  type: EventType;

  @Prop({ type: Number, required: true })
  count: number;
}

export const EventContentsSchema = SchemaFactory.createForClass(EventContents);

@Schema()
export class AttendanceContentClass {
  type: typeof EVENT_TYPE.ATTENDANCE;
  count: number;
}

export const AttendanceContentSchema = SchemaFactory.createForClass(
  AttendanceContentClass,
);

@Schema()
export class ConsecutiveAttendanceContentClass {
  type: typeof EVENT_TYPE.CONSECUTIVE_ATTENDANCE;
  count: number;
}

export const ConsecutiveAttendanceContentSchema = SchemaFactory.createForClass(
  ConsecutiveAttendanceContentClass,
);

@Schema()
export class QuestClearContentClass {
  type: typeof EVENT_TYPE.QUEST_CLEAR;
  count: number;

  @Prop({ type: Number, required: true })
  dataQuestId: number;

  @Prop({ type: String, required: true })
  name: string;
}

export const QuestClearContentSchema = SchemaFactory.createForClass(
  QuestClearContentClass,
);

@Schema()
export class FriendInviteContentClass {
  type: typeof EVENT_TYPE.FRIEND_INVITE;
  count: number;

  @Prop({ type: [String], default: [] })
  invitedUserIds: string[];
}

export const FriendInviteContentSchema = SchemaFactory.createForClass(
  FriendInviteContentClass,
);

export type AllEventContentsClass =
  | AttendanceContentClass
  | ConsecutiveAttendanceContentClass
  | QuestClearContentClass
  | FriendInviteContentClass;
