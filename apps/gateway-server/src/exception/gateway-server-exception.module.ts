import { Module } from '@nestjs/common';
import {
  ErrorHandlers,
  ExceptionHandler,
} from '@libs/shared/error/handler/abstract-error-handler';
import { UnhandledExceptionHandler } from '@libs/shared/error/handler/unhandled-exception-handler';
import { HttpExceptionHandler } from '@libs/shared/error/handler/http-exception-handler';
import { HttpServiceExceptionHandler } from '@libs/shared/error/handler/http-service-exception-handler';

import { GatewayServerExceptionHandler } from './gateway-server-exception-handler';

const errorHandlers = [
  GatewayServerExceptionHandler,
  HttpExceptionHandler,
  HttpServiceExceptionHandler,
  UnhandledExceptionHandler,
];

@Module({
  providers: [
    ...errorHandlers,
    {
      inject: errorHandlers,
      provide: ErrorHandlers,
      useFactory: (...errorHandlers: ExceptionHandler[]): ExceptionHandler[] =>
        errorHandlers,
    },
  ],
  exports: [ErrorHandlers],
})
export class GatewayServerExceptionModule {}
