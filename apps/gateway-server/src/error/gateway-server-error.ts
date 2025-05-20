import { HttpStatus } from '@nestjs/common';
import { ValueOf } from '@libs/core/types/value-of.type';
import { ErrorMap } from '@libs/core/exception/abstract-server-exception';
import { SERVER_ERROR_CODE } from '@libs/shared/error/server-error-code';

export const GATEWAY_SERVER_ERROR_KEY = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type GatewayServerErrorKey = ValueOf<typeof GATEWAY_SERVER_ERROR_KEY>;

export const GATEWAY_SERVER_ERROR: ErrorMap<GatewayServerErrorKey> = {
  [GATEWAY_SERVER_ERROR_KEY.UNKNOWN_ERROR]: {
    errorCode: SERVER_ERROR_CODE.UNKNOWN_ERROR_CODE,
    message: 'CRITICAL_UNKNOWN_ERROR',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
} as const;

export type GatewayServerErrorCode =
  (typeof GATEWAY_SERVER_ERROR)[keyof typeof GATEWAY_SERVER_ERROR]['errorCode'];
