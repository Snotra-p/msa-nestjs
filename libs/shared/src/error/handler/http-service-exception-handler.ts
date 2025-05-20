import { Injectable } from '@nestjs/common';
import { SERVER_ERROR_CODE } from '@libs/shared/error/server-error-code';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { HttpServiceException } from '@libs/shared/error/http-service-exception';

import { ExceptionHandler } from './abstract-error-handler';
@Injectable()
export class HttpServiceExceptionHandler implements ExceptionHandler {
  canHandle(exception: Error): boolean {
    return exception instanceof HttpServiceException;
  }

  getErrorResponse(exception: HttpServiceException): ResponseEntity<undefined> {
    const responseMessage = exception.message;
    const statusCode = exception.statusCode;

    return ResponseEntity.error(
      SERVER_ERROR_CODE.HTTP_SERVICE_ERROR,
      responseMessage,
      statusCode,
      exception.error,
    );
  }
}
