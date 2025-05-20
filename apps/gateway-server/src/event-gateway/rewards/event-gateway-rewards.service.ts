import { Injectable } from '@nestjs/common';
import { CreateRewardsInDto } from '@libs/shared/event-server/rewards/dto/create-rewards-in.dto';
import { RewardsDto } from '@libs/shared/event-server/rewards/dto/rewards.dto';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { HTTP_SERVICE_ERROR_KEY } from '@libs/shared/error/http-service-error';

import { EventHttpProvider } from '../../http/event/event-http.provider';

@Injectable()
export class EventGatewayRewardsService {
  constructor(private readonly httpProvider: EventHttpProvider) {}

  async create(dto: CreateRewardsInDto): Promise<ResponseEntity<RewardsDto>> {
    return await this.httpProvider.request<RewardsDto>(
      {
        url: '/rewards',
        method: 'POST',
        body: dto,
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_CREATE_REWARD,
    );
  }

  async findAll(): Promise<ResponseEntity<RewardsDto[]>> {
    return await this.httpProvider.request<RewardsDto[]>(
      {
        url: '/rewards',
        method: 'GET',
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_FIND_ALL_REWARDS,
    );
  }
}
