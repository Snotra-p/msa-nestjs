import { Injectable } from '@nestjs/common';
import { ProcessEventInDto } from '@libs/shared/event-server/user-event/dto/process-event-in.dto';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { HTTP_SERVICE_ERROR_KEY } from '@libs/shared/error/http-service-error';
import { UserEventDto } from '@libs/shared/event-server/user-event/dto/user-event.dto';

import { EventHttpProvider } from '../../http/event/event-http.provider';

@Injectable()
export class EventGatewayUserEventsService {
  constructor(private readonly httpProvider: EventHttpProvider) {}

  async getUserEvents(): Promise<ResponseEntity<UserEventDto[]>> {
    return await this.httpProvider.request<UserEventDto[]>(
      {
        url: '/user-events',
        method: 'GET',
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_FIND_ALL,
    );
  }

  async processEvent(
    dto: ProcessEventInDto,
  ): Promise<ResponseEntity<UserEventDto[]>> {
    return await this.httpProvider.request<UserEventDto[]>(
      {
        url: '/user-events/process',
        method: 'POST',
        body: dto,
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_CREATE,
    );
  }
}
