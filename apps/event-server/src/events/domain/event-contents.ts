import {
  EVENT_TYPE,
  EventType,
} from '@libs/shared/event-server/event/event-type';

export class EventContents {
  type: EventType;
  count: number;
}

export class AttendanceContent {
  type: typeof EVENT_TYPE.ATTENDANCE;
  count: number;
}

export class ConsecutiveAttendanceContent {
  type: typeof EVENT_TYPE.CONSECUTIVE_ATTENDANCE;
  count: number;
}

export class QuestClearContent {
  type: typeof EVENT_TYPE.QUEST_CLEAR;
  count: number;

  dataQuestId: number;
  name: string;
}

export class FriendInviteContent {
  type: typeof EVENT_TYPE.FRIEND_INVITE;
  count: number;

  invitedUserIds: string[];
}

export type AllEventContents =
  | AttendanceContent
  | ConsecutiveAttendanceContent
  | QuestClearContent
  | FriendInviteContent;
