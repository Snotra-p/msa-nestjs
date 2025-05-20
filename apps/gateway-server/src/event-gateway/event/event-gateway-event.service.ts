import { Injectable } from '@nestjs/common';
import { CreateEventInDto } from '@libs/shared/event-server/event/dto/create-event-in.dto';
import { QueryEventInDto } from '@libs/shared/event-server/event/dto/query-event-in.dto';
import { EventDto } from '@libs/shared/event-server/event/dto/event.dto';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { HTTP_SERVICE_ERROR_KEY } from '@libs/shared/error/http-service-error';

import { EventHttpProvider } from '../../http/event/event-http.provider';

@Injectable()
export class EventGatewayEventService {
  constructor(private readonly httpProvider: EventHttpProvider) {}

  async findAll(query: QueryEventInDto): Promise<ResponseEntity<EventDto[]>> {
    return await this.httpProvider.request<EventDto[]>(
      {
        url: '/events',
        method: 'GET',
        params: query,
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_FIND_ALL,
    );
  }

  async createEvent(dto: CreateEventInDto): Promise<ResponseEntity<EventDto>> {
    return await this.httpProvider.request<EventDto>(
      {
        url: '/events',
        method: 'POST',
        body: dto,
      },
      HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_CREATE,
    );
  }
}
