import { HttpStatus } from '@nestjs/common';
import { ValueOf } from '@libs/core/types/value-of.type';
import { ErrorMap } from '@libs/core/exception/abstract-server-exception';
import { SERVER_ERROR_CODE } from '@libs/shared/error/server-error-code';

export const EVENT_SERVER_ERROR_KEY = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
  REWARD_NOT_FOUND: 'REWARD_NOT_FOUND',
  INVALID_REQUEST: 'INVALID_REQUEST',
  EVENT_NOT_COMPLETED: 'EVENT_NOT_COMPLETED',
  INVALID_REWARD_STATUS: 'INVALID_REWARD_STATUS',
} as const;

export type EventServerErrorKey = ValueOf<typeof EVENT_SERVER_ERROR_KEY>;

export const EVENT_SERVER_ERROR: ErrorMap<EventServerErrorKey> = {
  [EVENT_SERVER_ERROR_KEY.UNKNOWN_ERROR]: {
    errorCode: SERVER_ERROR_CODE.UNKNOWN_ERROR_CODE,
    message: 'CRITICAL_UNKNOWN_ERROR',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [EVENT_SERVER_ERROR_KEY.EVENT_NOT_FOUND]: {
    errorCode: SERVER_ERROR_CODE.UNKNOWN_ERROR_CODE,
    message: 'EVENT_NOT_FOUND',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [EVENT_SERVER_ERROR_KEY.REWARD_NOT_FOUND]: {
    errorCode: SERVER_ERROR_CODE.UNKNOWN_ERROR_CODE,
    message: 'REWARD_NOT_FOUND',
    statusCode: HttpStatus.NOT_FOUND,
  },
  [EVENT_SERVER_ERROR_KEY.INVALID_REQUEST]: {
    errorCode: SERVER_ERROR_CODE.UNKNOWN_ERROR_CODE,
    message: 'INVALID_REQUEST',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [EVENT_SERVER_ERROR_KEY.EVENT_NOT_COMPLETED]: {
    errorCode: SERVER_ERROR_CODE.UNKNOWN_ERROR_CODE,
    message: 'EVENT_NOT_COMPLETED',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [EVENT_SERVER_ERROR_KEY.INVALID_REWARD_STATUS]: {
    errorCode: SERVER_ERROR_CODE.UNKNOWN_ERROR_CODE,
    message: 'INVALID_REWARD_STATUS',
    statusCode: HttpStatus.BAD_REQUEST,
  },
} as const;

export type EventServerErrorCode =
  (typeof EVENT_SERVER_ERROR)[keyof typeof EVENT_SERVER_ERROR]['errorCode'];
