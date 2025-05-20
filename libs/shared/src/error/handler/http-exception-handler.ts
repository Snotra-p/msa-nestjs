import { HttpException, Injectable } from '@nestjs/common';
import { SERVER_ERROR_CODE } from '@libs/shared/error/server-error-code';
import { ResponseEntity } from '@libs/core/dto/response-entity';

import { ExceptionHandler } from './abstract-error-handler';
@Injectable()
export class HttpExceptionHandler implements ExceptionHandler {
  canHandle(exception: Error): boolean {
    return exception instanceof HttpException;
  }

  getErrorResponse(exception: HttpException): ResponseEntity<undefined> {
    const response = exception.getResponse();
    const responseMessage =
      typeof response === 'string' ? response : JSON.stringify(response);

    return ResponseEntity.error(
      SERVER_ERROR_CODE.NORMAL_HTTP,
      responseMessage,
      exception.getStatus(),
    );
  }
}
