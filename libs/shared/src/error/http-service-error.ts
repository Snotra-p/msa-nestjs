import { HttpStatus } from '@nestjs/common';
import { ValueOf } from '@libs/core/types/value-of.type';
import { ErrorMap } from '@libs/core/exception/abstract-server-exception';

export const HTTP_SERVICE_ERROR_KEY = {
  AUTH_SERVER_LOGIN: 'AUTH_SERVER_LOGIN',
  AUTH_SERVER_LOGOUT: 'AUTH_SERVER_LOGOUT',
  AUTH_SERVER_REFRESH: 'AUTH_SERVER_REFRESH',
  AUTH_SERVER_CREATE_USER: 'AUTH_SERVER_CREATE_USER',
  AUTH_SERVER_FIND_ONE_USER: 'AUTH_SERVER_FIND_ONE_USER',
  AUTH_SERVER_FIND_ALL_USERS: 'AUTH_SERVER_FIND_ALL_USERS',
  AUTH_SERVER_UPDATE_USER: 'AUTH_SERVER_UPDATE_USER',
  AUTH_SERVER_DELETE_USER: 'AUTH_SERVER_DELETE_USER',
  EVENT_SERVER_CREATE_REWARD: 'EVENT_SERVER_CREATE_REWARD',
  EVENT_SERVER_FIND_ALL_REWARDS: 'EVENT_SERVER_FIND_ALL_REWARDS',
  EVENT_SERVER_FIND_ONE_REWARD: 'EVENT_SERVER_FIND_ONE_REWARD',
  EVENT_SERVER_APPROVE_REWARD: 'EVENT_SERVER_APPROVE_REWARD',
  EVENT_SERVER_REJECT_REWARD: 'EVENT_SERVER_REJECT_REWARD',
  EVENT_SERVER_FIND_ALL: 'EVENT_SERVER_FIND_ALL',
  EVENT_SERVER_CREATE: 'EVENT_SERVER_CREATE',
} as const;

export type HttpServiceErrorKey = ValueOf<typeof HTTP_SERVICE_ERROR_KEY>;

export const HTTP_SERVICE_ERROR: ErrorMap<HttpServiceErrorKey> = {
  [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_LOGIN]: {
    errorCode: 1000,
    message: '인증 서버 로그인 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_CREATE_USER]: {
    errorCode: 1001,
    message: '인증 서버 유저 생성 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_FIND_ONE_USER]: {
    errorCode: 1002,
    message: '인증 서버 유저 조회 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_FIND_ALL_USERS]: {
    errorCode: 1003,
    message: '인증 서버 유저 목록 조회 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_UPDATE_USER]: {
    errorCode: 1004,
    message: '인증 서버 유저 수정 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_DELETE_USER]: {
    errorCode: 1005,
    message: '인증 서버 유저 삭제 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_REFRESH]: {
    errorCode: 1006,
    message: '인증 서버 토큰 갱신 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.AUTH_SERVER_LOGOUT]: {
    errorCode: 1007,
    message: '인증 서버 로그아웃 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_FIND_ALL]: {
    errorCode: 2000,
    message: '이벤트 서버 이벤트 목록 조회 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_CREATE]: {
    errorCode: 2001,
    message: '이벤트 서버 이벤트 생성 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_FIND_ALL_REWARDS]: {
    errorCode: 2002,
    message: '이벤트 서버 보상 목록 조회 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_CREATE_REWARD]: {
    errorCode: 2003,
    message: '이벤트 서버 보상 생성 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_FIND_ONE_REWARD]: {
    errorCode: 2004,
    message: '이벤트 서버 보상 상세 조회 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_APPROVE_REWARD]: {
    errorCode: 2005,
    message: '이벤트 서버 보상 승인 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [HTTP_SERVICE_ERROR_KEY.EVENT_SERVER_REJECT_REWARD]: {
    errorCode: 2006,
    message: '이벤트 서버 보상 거절 실패',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
} as const;

export type HttpServiceErrorCode =
  (typeof HTTP_SERVICE_ERROR)[keyof typeof HTTP_SERVICE_ERROR]['errorCode'];
