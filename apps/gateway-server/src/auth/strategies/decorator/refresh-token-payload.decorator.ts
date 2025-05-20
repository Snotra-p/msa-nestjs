import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtRefreshPayloadType } from '../types/jwt-refresh-payload.type';

export const RefreshTokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: JwtRefreshPayloadType }>();

    return request.user;
  },
);
