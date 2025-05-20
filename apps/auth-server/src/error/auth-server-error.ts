import { HttpStatus } from '@nestjs/common';
import { ValueOf } from '@libs/core/types/value-of.type';
import { ErrorMap } from '@libs/core/exception/abstract-server-exception';

import { SERVER_ERROR_CODE } from '../../../../libs/shared/src/error/server-error-code';

export const AUTH_SERVER_ERROR_KEY = {
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SESSION_HASH_NOT_MATCH: 'SESSION_HASH_NOT_MATCH',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  AUTH_PASSWORD_INCORRECT: 'AUTH_PASSWORD_INCORRECT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type AuthServerErrorKey = ValueOf<typeof AUTH_SERVER_ERROR_KEY>;

export const AUTH_SERVER_ERROR: ErrorMap<AuthServerErrorKey> = {
  [AUTH_SERVER_ERROR_KEY.SESSION_EXPIRED]: {
    errorCode: 1000,
    message: '세션이 만료되었습니다.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [AUTH_SERVER_ERROR_KEY.SESSION_NOT_FOUND]: {
    errorCode: 1001,
    message: '세션을 찾을 수 없습니다.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [AUTH_SERVER_ERROR_KEY.SESSION_HASH_NOT_MATCH]: {
    errorCode: 1002,
    message: '세션 해시가 일치하지 않습니다.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [AUTH_SERVER_ERROR_KEY.USER_NOT_FOUND]: {
    errorCode: 1003,
    message: '유저를 찾을 수 없습니다.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [AUTH_SERVER_ERROR_KEY.USER_ALREADY_EXISTS]: {
    errorCode: 1002,
    message: '이미 존재하는 유저입니다.',
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  },
  [AUTH_SERVER_ERROR_KEY.AUTH_PASSWORD_INCORRECT]: {
    errorCode: 1003,
    message: '비밀번호가 일치하지 않습니다.',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [AUTH_SERVER_ERROR_KEY.UNKNOWN_ERROR]: {
    errorCode: SERVER_ERROR_CODE.UNKNOWN_ERROR_CODE,
    message: 'CRITICAL_UNKNOWN_ERROR',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
} as const;

export type AuthServerErrorCode =
  (typeof AUTH_SERVER_ERROR)[keyof typeof AUTH_SERVER_ERROR]['errorCode'];
