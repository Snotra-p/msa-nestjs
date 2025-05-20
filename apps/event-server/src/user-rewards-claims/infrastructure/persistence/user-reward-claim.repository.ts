import { NullableType } from '@libs/core/types/nullable.type';
import { PaginationOutDto } from '@libs/core/dto/pagination/pagination-out.dto';
import { FilterUserRewardsClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/filter-user-rewards-claim-in.dto';
import { SortUserRewardClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/sort-user-reward-claim-in.dto';
import { RewardsClaimStatus } from '@libs/shared/event-server/user-rewards-claims/reward-claim-status';

import { UserRewardsClaim } from '../../domain/user-rewards-claim';

export abstract class UserRewardClaimRepository {
  abstract create(params: {
    userId: string;
    eventId: string;
    rewardsId: string;
    status: RewardsClaimStatus;
    processedAt: Date | null;
  }): Promise<UserRewardsClaim>;

  abstract findById(id: string): Promise<NullableType<UserRewardsClaim>>;

  abstract findByUserId(userId: string): Promise<UserRewardsClaim[]>;

  abstract findByUserIdAndEventId(
    userId: string,
    eventId: string,
  ): Promise<NullableType<UserRewardsClaim>>;

  abstract findManyWithPagination(params: {
    filterOptions?: FilterUserRewardsClaimInDto;
    sortOptions?: SortUserRewardClaimInDto[];
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<[UserRewardsClaim[], PaginationOutDto]>;

  abstract update(
    id: string,
    params: {
      status: RewardsClaimStatus;
      processedAt: Date | null;
    },
  ): Promise<UserRewardsClaim>;
}
