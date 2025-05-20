import { Injectable } from '@nestjs/common';
import { ResponseEntity } from '@libs/core/dto/response-entity';
import { ExceptionHandler } from '@libs/shared/error/handler/abstract-error-handler';

import { GatewayServerException } from '../error/gateway-server-exception';

@Injectable()
export class GatewayServerExceptionHandler implements ExceptionHandler {
  canHandle(exception: Error): boolean {
    return exception instanceof GatewayServerException;
  }

  getErrorResponse(
    exception: GatewayServerException,
  ): ResponseEntity<undefined> {
    return ResponseEntity.error(
      exception.errorCode,
      exception.message,
      exception.statusCode,
    );
  }
}
