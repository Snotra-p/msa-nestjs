import { Injectable } from '@nestjs/common';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { SERVER_ERROR_CODE } from '@libs/shared/error/server-error-code';

import { ExceptionHandler } from './abstract-error-handler';

@Injectable()
export class UnhandledExceptionHandler implements ExceptionHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canHandle(_exception: Error): boolean {
    return true;
  }

  getErrorResponse(exception: Error): ResponseEntity<undefined> {
    return ResponseEntity.error(
      SERVER_ERROR_CODE.UNKNOWN_ERROR_CODE,
      exception.message,
    );
  }
}
