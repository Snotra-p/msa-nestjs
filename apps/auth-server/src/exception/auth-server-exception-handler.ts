import { Injectable } from '@nestjs/common';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { ExceptionHandler } from '@libs/shared/error/handler/abstract-error-handler';

import { AuthServerException } from '../error/auth-server-exception';

@Injectable()
export class AuthServerExceptionHandler implements ExceptionHandler {
  canHandle(exception: Error): boolean {
    return exception instanceof AuthServerException;
  }

  getErrorResponse(exception: AuthServerException): ResponseEntity<undefined> {
    return ResponseEntity.error(
      exception.errorCode,
      exception.message,
      exception.statusCode,
    );
  }
}
