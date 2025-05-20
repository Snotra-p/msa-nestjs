export const EVENT_TYPE = {
  ATTENDANCE: 'attendance',
  CONSECUTIVE_ATTENDANCE: 'consecutive_attendance',
  QUEST_CLEAR: 'quest_clear',
  FRIEND_INVITE: 'friend_invite',
} as const;

export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];
