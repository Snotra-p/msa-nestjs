import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NullableType } from '@libs/core/types/nullable.type';
import { PaginationOutDto } from '@libs/core/dto/pagination/pagination-out.dto';
import { FilterUserRewardsClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/filter-user-rewards-claim-in.dto';
import { SortUserRewardClaimInDto } from '@libs/shared/event-server/user-rewards-claims/dto/sort-user-reward-claim-in.dto';
import { RewardsClaimStatus } from '@libs/shared/event-server/user-rewards-claims/reward-claim-status';

import { EventServerException } from '../../../../error/event-server-exception';
import { EVENT_SERVER_ERROR_KEY } from '../../../../error/event-server-error';
import { UserRewardClaimRepository } from '../user-reward-claim.repository';
import { UserRewardsClaim } from '../../../domain/user-rewards-claim';
import { UserRewardClaimMapper } from '../mappers/user-reward-claim-mapper';
import { UserRewardsClaimSchemaClass } from '../entities/user-reward-claim.schema';

export class UserRewardClaimMongooseRepository
  implements UserRewardClaimRepository
{
  constructor(
    @InjectModel(UserRewardsClaimSchemaClass.name)
    private userRewardClaimModel: Model<UserRewardsClaimSchemaClass>,
  ) {}

  async create(
    data: Omit<
      UserRewardsClaim,
      'id' | 'createdAt' | 'deletedAt' | 'updatedAt'
    >,
  ): Promise<UserRewardsClaim> {
    const userRewardClaim = await this.userRewardClaimModel.create(data);
    return UserRewardClaimMapper.toDomain(userRewardClaim);
  }

  async findById(
    id: UserRewardsClaim['id'],
  ): Promise<NullableType<UserRewardsClaim>> {
    const userRewardClaim = await this.userRewardClaimModel.findById(id);
    return userRewardClaim
      ? UserRewardClaimMapper.toDomain(userRewardClaim)
      : null;
  }

  async findByUserId(userId: string): Promise<UserRewardsClaim[]> {
    const userRewardClaims = await this.userRewardClaimModel.find({
      userId,
    });
    return userRewardClaims.map((userRewardClaim) =>
      UserRewardClaimMapper.toDomain(userRewardClaim),
    );
  }

  async findByUserIdAndEventId(
    userId: string,
    eventId: string,
  ): Promise<NullableType<UserRewardsClaim>> {
    const userRewardClaim = await this.userRewardClaimModel.findOne({
      userId,
      eventId,
    });
    return userRewardClaim
      ? UserRewardClaimMapper.toDomain(userRewardClaim)
      : null;
  }

  async findManyWithPagination(options: {
    filterOptions?: FilterUserRewardsClaimInDto;
    sortOptions?: SortUserRewardClaimInDto[];
    paginationOptions: {
      page: number;
      limit: number;
    };
  }): Promise<[UserRewardsClaim[], PaginationOutDto]> {
    const { filterOptions, sortOptions, paginationOptions } = options;
    const { page, limit } = paginationOptions;

    const query = this.userRewardClaimModel.find();

    // 필터 옵션 적용
    if (filterOptions?.userId) {
      query.where('userId').equals(filterOptions.userId);
    }
    if (filterOptions?.eventId) {
      query.where('eventId').equals(filterOptions.eventId);
    }
    if (filterOptions?.rewardsId) {
      query.where('rewardsId').equals(filterOptions.rewardsId);
    }

    // 정렬 옵션 적용
    if (sortOptions) {
      sortOptions.forEach((sortOption) => {
        query.sort({ [sortOption.orderBy]: sortOption.order });
      });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    const [userRewardClaims, total] = await Promise.all([
      query.exec(),
      this.userRewardClaimModel.countDocuments(query.getQuery()),
    ]);

    const pagination = new PaginationOutDto({
      page,
      size: limit,
      totalElements: total,
      totalPages: Math.ceil(total / limit),
    });

    return [
      userRewardClaims.map((claim) => UserRewardClaimMapper.toDomain(claim)),
      pagination,
    ];
  }

  async update(
    id: string,
    params: {
      status: RewardsClaimStatus;
      processedAt: Date | null;
    },
  ): Promise<UserRewardsClaim> {
    const updatedUserRewardClaim =
      await this.userRewardClaimModel.findByIdAndUpdate(
        id,
        {
          $set: {
            status: params.status,
            processedAt: params.processedAt,
          },
        },
        { new: true },
      );

    if (!updatedUserRewardClaim) {
      throw new EventServerException(EVENT_SERVER_ERROR_KEY.REWARD_NOT_FOUND);
    }

    return UserRewardClaimMapper.toDomain(updatedUserRewardClaim);
  }
}
