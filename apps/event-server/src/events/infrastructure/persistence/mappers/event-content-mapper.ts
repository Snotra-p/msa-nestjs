import { EVENT_TYPE } from '@libs/shared/event-server/event/event-type';

import {
  AllEventContents,
  AttendanceContent,
  ConsecutiveAttendanceContent,
  FriendInviteContent,
  QuestClearContent,
} from '../../../domain/event-contents';
import {
  AllEventContentsClass,
  AttendanceContentClass,
  ConsecutiveAttendanceContentClass,
  FriendInviteContentClass,
  QuestClearContentClass,
} from '../entities/event-contents.schema';

/**
 * 타입 가드
 */
const isAttendanceContent = (
  schema: AllEventContentsClass,
): schema is AttendanceContentClass => schema.type === EVENT_TYPE.ATTENDANCE;

const isConsecutiveAttendanceContent = (
  schema: AllEventContentsClass,
): schema is ConsecutiveAttendanceContentClass =>
  schema.type === EVENT_TYPE.CONSECUTIVE_ATTENDANCE;

const isQuestClearContent = (
  schema: AllEventContentsClass,
): schema is QuestClearContentClass => schema.type === EVENT_TYPE.QUEST_CLEAR;

const isFriendInviteContent = (
  schema: AllEventContentsClass,
): schema is FriendInviteContentClass =>
  schema.type === EVENT_TYPE.FRIEND_INVITE;

/**
 * 도메인 매핑
 */
export class EventContentMapper {
  static toDomain(schema: AllEventContentsClass): AllEventContents {
    if (isAttendanceContent(schema)) {
      return {
        type: EVENT_TYPE.ATTENDANCE,
        count: schema.count,
      } satisfies AttendanceContent;
    } else if (isConsecutiveAttendanceContent(schema)) {
      return {
        type: EVENT_TYPE.CONSECUTIVE_ATTENDANCE,
        count: schema.count,
      } satisfies ConsecutiveAttendanceContent;
    } else if (isQuestClearContent(schema)) {
      return {
        type: EVENT_TYPE.QUEST_CLEAR,
        count: schema.count,
        dataQuestId: schema.dataQuestId,
        name: schema.name,
      } satisfies QuestClearContent;
    } else if (isFriendInviteContent(schema)) {
      return {
        type: EVENT_TYPE.FRIEND_INVITE,
        count: schema.count,
        invitedUserIds: schema.invitedUserIds,
      } satisfies FriendInviteContent;
    }

    throw new Error('Invalid reward content type');
  }

  static toPersistence(domain: AllEventContents): AllEventContentsClass {
    if (domain.type === EVENT_TYPE.ATTENDANCE) {
      const persistence = new AttendanceContentClass();
      persistence.type = domain.type;
      persistence.count = domain.count;
      return persistence;
    } else if (domain.type === EVENT_TYPE.CONSECUTIVE_ATTENDANCE) {
      const persistence = new ConsecutiveAttendanceContentClass();
      persistence.type = domain.type;
      persistence.count = domain.count;
      return persistence;
    } else if (domain.type === EVENT_TYPE.QUEST_CLEAR) {
      const persistence = new QuestClearContentClass();
      persistence.type = domain.type;
      persistence.count = domain.count;
      persistence.dataQuestId = domain.dataQuestId;
      persistence.name = domain.name;
      return persistence;
    } else if (domain.type === EVENT_TYPE.FRIEND_INVITE) {
      const persistence = new FriendInviteContentClass();
      persistence.type = domain.type;
      persistence.count = domain.count;
      persistence.invitedUserIds = domain.invitedUserIds;
      return persistence;
    }

    throw new Error('Invalid reward content type');
  }
}
