import { HttpService } from '@nestjs/axios';
import { BaseHttpService } from '@libs/core/network/base-http-service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AllGateWayConfigType } from '../../config/config.type';

@Injectable()
export class AuthHttpProvider extends BaseHttpService {
  constructor(
    protected readonly httpService: HttpService,
    private readonly configService: ConfigService<AllGateWayConfigType>,
  ) {
    super(
      httpService,
      configService.getOrThrow('httpService.authServerHost', { infer: true }),
      configService.getOrThrow('httpService.authServerPort', { infer: true }),
    );

    this.headers = {
      'Content-Type': 'application/json',
      // 'X-API-KEY': process.env.ADMIN_SERVER_API_KEY,
    };
  }
}
