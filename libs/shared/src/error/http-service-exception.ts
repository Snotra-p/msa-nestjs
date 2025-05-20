import {
  ErrorMap,
  IGNORE_LOGGING_KEY,
} from '@libs/core/exception/abstract-server-exception';
import { HttpStatus } from '@nestjs/common';

import { HttpServiceErrorKey } from './http-service-error';

export class HttpServiceException extends Error {
  readonly statusCode: HttpStatus;
  readonly errorCode: number;
  readonly [IGNORE_LOGGING_KEY]?: boolean;

  constructor(
    errorKey: HttpServiceErrorKey,
    errorMap: ErrorMap<HttpServiceErrorKey>,
    message?: string,
    readonly error?: unknown,
    ignoreLogging?: boolean,
  ) {
    const errorData = errorMap[errorKey];
    super(message ?? errorData.message);
    this.statusCode = errorData.statusCode;
    this.errorCode = errorData.errorCode;
    this[IGNORE_LOGGING_KEY] = ignoreLogging;
    this.error = error;
  }
}
