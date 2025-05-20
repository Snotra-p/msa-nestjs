import { Injectable } from '@nestjs/common';
import { CreateUserRewardsClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/create-user-rewards-claim-in.dto';
import { UserRewardsClaimDto } from '@libs/shared/event-server/user-rewards-claims/dto/user-rewards-claim.dto';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { HTTP_SERVICE_ERROR_KEY } from '@libs/shared/error/http-service-error';
import { FilterUserRewardsClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/filter-user-rewards-claim-in.dto';
import { SortUserRewardClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/sort-user-reward-claim-in.dto';

import { EventHttpProvider } from '../../http/event/event-http.provider';

@Injectable()
export class EventGatewayUserRewardsClaimsService {
  constructor(private readonly httpProvider: EventHttpProvider) {}

  async findManyWithPagination(params: {
    filterOptions?: FilterUserRewardsClaimInDto;
    sortOptions?: SortUserRewardClaimInDto[];
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<ResponseEntity<UserRewardsClaimDto[]>> {
    const { filterOptions, sortOptions, paginationOptions } = params;

    return await this.httpProvider.request<UserRewardsClaimDto[]>(
      {
        url: '/user-reward-claims',
        method: 'GET',
        params: {
          ...filterOptions,
          ...sortOptions,
          page: paginationOptions.page,
          limit: paginationOptions.limit,
        },
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_FIND_ALL_REWARDS,
    );
  }

  async findOne(id: string): Promise<ResponseEntity<UserRewardsClaimDto>> {
    return await this.httpProvider.request<UserRewardsClaimDto>(
      {
        url: `/user-reward-claims/me`,
        method: 'GET',
        params: {
          userId: id,
        },
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_FIND_ONE_REWARD,
    );
  }

  async create(
    dto: CreateUserRewardsClaimInDto,
  ): Promise<ResponseEntity<UserRewardsClaimDto>> {
    return await this.httpProvider.request<UserRewardsClaimDto>(
      {
        url: '/user-reward-claims',
        method: 'POST',
        body: dto,
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_CREATE_REWARD,
    );
  }

  async approve(id: string): Promise<ResponseEntity<UserRewardsClaimDto>> {
    return await this.httpProvider.request<UserRewardsClaimDto>(
      {
        url: `/user-reward-claims/approve`,
        method: 'PATCH',
        body: {
          id,
        },
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_APPROVE_REWARD,
    );
  }

  async reject(id: string): Promise<ResponseEntity<UserRewardsClaimDto>> {
    return await this.httpProvider.request<UserRewardsClaimDto>(
      {
        url: `/user-reward-claims/reject`,
        method: 'PATCH',
        body: {
          id,
        },
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_REJECT_REWARD,
    );
  }
}
