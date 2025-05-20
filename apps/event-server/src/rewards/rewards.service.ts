import { Injectable } from '@nestjs/common';
import { CreateRewardsInDto } from '@libs/shared/event-server/rewards/dto/create-rewards-in.dto';

import { RewardsRepository } from './infrastructure/persistence/rewards.repository';
import { EventRepository } from '../events/infrastructure/persistence/event.repository';
import { EventServerException } from '../error/event-server-exception';
import { EVENT_SERVER_ERROR_KEY } from '../error/event-server-error';

@Injectable()
export class RewardsService {
  constructor(
    private readonly rewardsRepository: RewardsRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async create(createRewardsDto: CreateRewardsInDto) {
    const event = await this.eventRepository.findById(createRewardsDto.eventId);
    if (
      !event ||
      !event.activate ||
      event.startedAt > new Date() ||
      event.endedAt < new Date()
    ) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.EVENT_NOT_FOUND);
    }

    const reward = await this.rewardsRepository.create({
      eventId: createRewardsDto.eventId,
      userId: createRewardsDto.userId,
      contents: createRewardsDto.contents,
    });

    return reward;
  }

  async findAll() {
    return this.rewardsRepository.findAll();
  }
}
