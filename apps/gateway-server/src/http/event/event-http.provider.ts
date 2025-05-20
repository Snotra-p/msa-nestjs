import { BaseHttpService } from '@libs/core/network/base-http-service';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { AllGateWayConfigType } from '../../config/config.type';

@Injectable()
export class EventHttpProvider extends BaseHttpService {
  constructor(
    protected readonly httpService: HttpService,
    private readonly configService: ConfigService<AllGateWayConfigType>,
  ) {
    super(
      httpService,
      configService.getOrThrow('httpService.eventServerHost', { infer: true }),
      configService.getOrThrow('httpService.eventServerPort', { infer: true }),
    );

    this.headers = {
      'Content-Type': 'application/json',
      // 'X-API-KEY': process.env.REGION_SERVER_API_KEY,
    };
  }
}
