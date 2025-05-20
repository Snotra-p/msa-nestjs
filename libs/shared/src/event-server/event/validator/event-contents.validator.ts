import { plainToInstance } from 'class-transformer';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validateSync,
} from 'class-validator';

import {
  AllEventContentsDto,
  AttendanceContentDto,
  ConsecutiveAttendanceContentDto,
  FriendInviteContentDto,
  QuestClearContentDto,
} from '../dto/event-contents.dto';
import { EVENT_TYPE } from '../event-type';

@ValidatorConstraint({ name: 'EventContentsValidator', async: false })
export class EventContentsValidator implements ValidatorConstraintInterface {
  validate(values: AllEventContentsDto[]) {
    const types = values.map((it) => it.type);
    if (types.length !== new Set(types).size) {
      return false;
    }

    return values.every((item) => {
      if (item.type === EVENT_TYPE.ATTENDANCE) {
        return (
          validateSync(plainToInstance(AttendanceContentDto, item)).length === 0
        );
      } else if (item.type === EVENT_TYPE.CONSECUTIVE_ATTENDANCE) {
        return (
          validateSync(plainToInstance(ConsecutiveAttendanceContentDto, item))
            .length === 0
        );
      } else if (item.type === EVENT_TYPE.QUEST_CLEAR) {
        return (
          validateSync(plainToInstance(QuestClearContentDto, item)).length === 0
        );
      } else if (item.type === EVENT_TYPE.FRIEND_INVITE) {
        return (
          validateSync(plainToInstance(FriendInviteContentDto, item)).length ===
          0
        );
      }
      return false;
    });
  }

  defaultMessage() {
    return 'validate type error';
  }
}
