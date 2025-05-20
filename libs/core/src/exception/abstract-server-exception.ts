import { HttpStatus } from '@nestjs/common';

export type ErrorMap<T extends string> = Record<
  T,
  {
    statusCode: HttpStatus;
    errorCode: number;
    message: string;
  }
>;

export const IGNORE_LOGGING_KEY = Symbol('ignoreLogKey');

export abstract class AbstractServerException<K extends string> extends Error {
  readonly statusCode: HttpStatus;
  readonly errorCode: number;
  readonly [IGNORE_LOGGING_KEY]?: boolean;

  protected constructor(
    errorKey: K,
    errorMap: ErrorMap<K>,
    message?: string,
    ignoreLogging?: boolean,
  ) {
    const errorData = errorMap[errorKey];
    super(message ?? errorData.message);
    this.statusCode = errorData.statusCode;
    this.errorCode = errorData.errorCode;
    this[IGNORE_LOGGING_KEY] = ignoreLogging;
  }
}
