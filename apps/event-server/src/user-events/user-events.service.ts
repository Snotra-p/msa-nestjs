import { Injectable } from '@nestjs/common';
import {
  EVENT_TYPE,
  EventType,
} from '@libs/shared/event-server/event/event-type';
import { ProcessEventInDto } from '@libs/shared/event-server/user-event/dto/process-event-in.dto';
import { NullableType } from '@libs/core/types/nullable.type';
import { UserEventDto } from '@libs/shared/event-server/user-event/dto/user-event.dto';

import { UserEventRepository } from './infrastructure/persistence/user-event.repository';
import { UserEvent } from './domain/user-event';
import { EventRepository } from '../events/infrastructure/persistence/event.repository';
import { EventServerException } from '../error/event-server-exception';
import { EVENT_SERVER_ERROR_KEY } from '../error/event-server-error';
import { Event } from '../events/domain/event';
import {
  AttendanceContent,
  FriendInviteContent,
  QuestClearContent,
} from '../events/domain/event-contents';
@Injectable()
export class UserEventsService {
  private readonly eventProcessors: Record<
    EventType,
    (
      userEvent: NullableType<UserEvent>,
      event: Event,
      dto: ProcessEventInDto,
    ) => UserEvent
  > = {
    [EVENT_TYPE.ATTENDANCE]: this.attandanceProcess.bind(this),
    [EVENT_TYPE.CONSECUTIVE_ATTENDANCE]: this.attandanceProcess.bind(this),
    [EVENT_TYPE.QUEST_CLEAR]: this.questClearProcess.bind(this),
    [EVENT_TYPE.FRIEND_INVITE]: this.friendInviteProcess.bind(this),
  };

  constructor(
    private readonly userEventRepository: UserEventRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async getUserEvents(): Promise<UserEventDto[]> {
    return UserEventDto.fromEntities(await this.userEventRepository.find());
  }

  async processEvent(dto: ProcessEventInDto): Promise<UserEventDto[]> {
    const events = await this.eventRepository.findByTypeAndDateAndActive(
      dto.eventType,
      new Date(),
    );

    if (!events || events.length === 0) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.EVENT_NOT_FOUND);
    }

    const processor = this.eventProcessors[dto.eventType];
    if (!processor) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.EVENT_NOT_FOUND);
    }

    const newUserEvents: UserEvent[] = [];
    const updatedUserEvents: UserEvent[] = [];

    const userEvents = await this.userEventRepository.findByEventIds(
      events.map((it) => it.id),
    );

    const userEventByEventId = Object.fromEntries(
      userEvents.map((it) => [it.eventId, it]),
    );

    for (const event of events) {
      const userEvent = userEventByEventId[event.id] ?? null;
      const updatedUserEvent = processor(userEvent, event, dto);

      if (updatedUserEvent.id) {
        updatedUserEvents.push(updatedUserEvent);
      } else {
        newUserEvents.push(updatedUserEvent);
      }
    }

    return UserEventDto.fromEntities(
      (
        await Promise.all([
          this.userEventRepository.createMany(newUserEvents),
          this.userEventRepository.updateMany(updatedUserEvents),
        ])
      ).flat(),
    );
  }

  // 연속출석 , 출석 조건 처리
  private attandanceProcess(
    userEvent: NullableType<UserEvent>,
    event: Event,
    dto: ProcessEventInDto,
  ) {
    if (!dto.count) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.INVALID_REQUEST);
    }

    if (!userEvent) {
      userEvent = new UserEvent();
      userEvent.eventId = event.id;
      userEvent.userId = dto.userId;
      userEvent.contents = {
        type: EVENT_TYPE.ATTENDANCE,
        count: dto.count ?? 1,
      } satisfies AttendanceContent;
    } else if (userEvent.completedAt) {
      return userEvent;
    } else {
      userEvent.contents.count = dto.count;
    }

    const attendanceContent = event.contents.find(
      (it) => it.type === 'attendance',
    ) as AttendanceContent;

    if (attendanceContent.count >= userEvent.contents.count) {
      userEvent.completedAt = new Date();
    }

    return userEvent;
  }

  // 퀘스트 클리어 조건 처리
  private questClearProcess(
    userEvent: NullableType<UserEvent>,
    event: Event,
    dto: ProcessEventInDto,
  ) {
    if (!dto.value || !dto.count) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.INVALID_REQUEST);
    }

    if (!userEvent) {
      userEvent = new UserEvent();
      userEvent.eventId = event.id;
      userEvent.userId = dto.userId;
      userEvent.contents = {
        type: EVENT_TYPE.QUEST_CLEAR,
        dataQuestId: dto.value,
        name: 'quest clear',
        count: dto.count,
      } satisfies QuestClearContent;
    } else if (userEvent.completedAt) {
      return userEvent;
    } else {
      userEvent.contents.count = dto.count;
    }

    const questClearContent = event.contents.find(
      (it) => it.type === 'quest_clear',
    ) as QuestClearContent;

    if (
      questClearContent.dataQuestId ==
        (userEvent.contents as QuestClearContent).dataQuestId &&
      questClearContent.count >= userEvent.contents.count
    ) {
      userEvent.completedAt = new Date();
    }

    return userEvent;
  }

  private friendInviteProcess(
    userEvent: NullableType<UserEvent>,
    event: Event,
    dto: ProcessEventInDto,
  ) {
    if (!dto.value) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.INVALID_REQUEST);
    }

    if (!userEvent) {
      userEvent = new UserEvent();
      userEvent.eventId = event.id;
      userEvent.userId = dto.userId;
      userEvent.contents = {
        type: EVENT_TYPE.FRIEND_INVITE,
        count: dto.count ?? 1,
        invitedUserIds: [dto.value.toString()],
      } satisfies FriendInviteContent;
    } else if (userEvent.completedAt) {
      return userEvent;
    } else if (
      !(userEvent.contents as FriendInviteContent).invitedUserIds.includes(
        dto.value.toString(),
      )
    ) {
      (userEvent.contents as FriendInviteContent).invitedUserIds.push(
        dto.value.toString(),
      );
    }

    const friendInviteContent = event.contents.find(
      (it) => it.type === 'friend_invite',
    ) as FriendInviteContent;

    if (
      friendInviteContent.invitedUserIds.length >=
      (userEvent.contents as FriendInviteContent).invitedUserIds.length
    ) {
      userEvent.completedAt = new Date();
    }

    return userEvent;
  }
}
