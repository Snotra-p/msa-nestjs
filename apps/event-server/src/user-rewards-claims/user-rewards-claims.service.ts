import { Injectable } from '@nestjs/common';
import { PaginationOutDto } from '@libs/core/dto/pagination/pagination-out.dto';
import { CreateUserRewardsClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/create-user-rewards-claim-in.dto';
import { REWARDS_CLAIM_STATUS } from '@libs/shared/event-server/user-rewards-claims/reward-claim-status';
import { UserRewardsClaimDto } from '@libs/shared/event-server/user-rewards-claims/dto/user-rewards-claim.dto';
import { UserRewardsClaimsQueryInDto } from '@libs/shared/event-server/user-rewards-claims/dto/query-user-rewards-claim-in.dto';

import { UserRewardClaimRepository } from './infrastructure/persistence/user-reward-claim.repository';
import { EventRepository } from '../events/infrastructure/persistence/event.repository';
import { EventServerException } from '../error/event-server-exception';
import { EVENT_SERVER_ERROR_KEY } from '../error/event-server-error';
import { RewardsRepository } from '../rewards/infrastructure/persistence/rewards.repository';
import { UserEventRepository } from '../user-events/infrastructure/persistence/user-event.repository';
import { Rewards } from '../rewards/domain/rewards';
@Injectable()
export class UserRewardsClaimsService {
  constructor(
    private readonly userRewardClaimRepository: UserRewardClaimRepository,
    private readonly eventRepository: EventRepository,
    private readonly rewardsRepository: RewardsRepository,
    private readonly userEventRepository: UserEventRepository,
  ) {}

  async findOne(userId: string): Promise<UserRewardsClaimDto> {
    const userRewardClaim =
      await this.userRewardClaimRepository.findById(userId);

    return UserRewardsClaimDto.fromEntity(userRewardClaim);
  }

  async findManyWithPagination(
    query: UserRewardsClaimsQueryInDto,
  ): Promise<[UserRewardsClaimDto[], PaginationOutDto]> {
    const { filters, sort, page, limit } = query;

    const [userRewardClaims, pagination] =
      await this.userRewardClaimRepository.findManyWithPagination({
        filterOptions: filters,
        sortOptions: sort,
        paginationOptions: {
          page: page ?? 1,
          limit: limit ?? 10,
        },
      });

    return [UserRewardsClaimDto.fromEntities(userRewardClaims), pagination];
  }

  async create(
    createUserRewardClaimDto: CreateUserRewardsClaimInDto,
  ): Promise<UserRewardsClaimDto> {
    const rewards = await this.rewardsRepository.findById(
      createUserRewardClaimDto.rewardsId,
    );

    if (!rewards) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.REWARD_NOT_FOUND);
    }

    const event = await this.eventRepository.findById(rewards.eventId);

    if (
      !event ||
      !event.activate ||
      event.startedAt > new Date() ||
      event.endedAt < new Date()
    ) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.EVENT_NOT_FOUND);
    }

    const userEvents = await this.userEventRepository.findByUserIdAndEventId(
      createUserRewardClaimDto.userId,
      event.id,
    );

    // obj hash map
    const userEventByType = Object.fromEntries(
      userEvents.map((it) => [it.contents.type, it]),
    );

    // validation check
    for (const eventContent of event.contents) {
      const userEvent = userEventByType[eventContent.type];

      if (!userEvent?.completedAt) {
        throw new EventServerException(
          EVENT_SERVER_ERROR_KEY.EVENT_NOT_COMPLETED,
        );
      }
    }

    const userRewardClaim = await this.userRewardClaimRepository.create({
      ...createUserRewardClaimDto,
      eventId: event.id,
      status: event.requireApproval
        ? REWARDS_CLAIM_STATUS.PENDING
        : REWARDS_CLAIM_STATUS.PROCESSING,
      processedAt: event.requireApproval ? null : new Date(),
    });

    if (event.requireApproval) {
      this.processReward(
        createUserRewardClaimDto.userId,
        userRewardClaim.id,
        rewards,
      );
    }

    return UserRewardsClaimDto.fromEntity(userRewardClaim);
  }

  //  다른 서비스에 보상 지급 요청(Message Queue 등)
  private processReward(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userRewardClaimId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _rewards: Rewards,
  ) {
    // not implemented
  }

  async approve(id: string): Promise<UserRewardsClaimDto> {
    const userRewardClaim = await this.userRewardClaimRepository.findById(id);

    if (!userRewardClaim) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.REWARD_NOT_FOUND);
    }

    if (userRewardClaim.status !== REWARDS_CLAIM_STATUS.PENDING) {
      throw new EventServerException(
        EVENT_SERVER_ERROR_KEY.INVALID_REWARD_STATUS,
      );
    }

    const updatedUserRewardClaim = await this.userRewardClaimRepository.update(
      id,
      {
        status: REWARDS_CLAIM_STATUS.PROCESSING,
        processedAt: new Date(),
      },
    );

    return UserRewardsClaimDto.fromEntity(updatedUserRewardClaim);
  }

  async reject(id: string): Promise<UserRewardsClaimDto> {
    const userRewardClaim = await this.userRewardClaimRepository.findById(id);

    if (!userRewardClaim) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.REWARD_NOT_FOUND);
    }

    if (userRewardClaim.status !== REWARDS_CLAIM_STATUS.PENDING) {
      throw new EventServerException(
        EVENT_SERVER_ERROR_KEY.INVALID_REWARD_STATUS,
      );
    }

    const updatedUserRewardClaim = await this.userRewardClaimRepository.update(
      id,
      {
        status: REWARDS_CLAIM_STATUS.REJECTED,
        processedAt: new Date(),
      },
    );

    return UserRewardsClaimDto.fromEntity(updatedUserRewardClaim);
  }
}
