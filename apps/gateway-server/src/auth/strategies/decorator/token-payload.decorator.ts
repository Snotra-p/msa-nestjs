import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayloadType } from '../types/jwt-payload.type';

export const TokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: JwtPayloadType }>();

    return request.user;
  },
);
