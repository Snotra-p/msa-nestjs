import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import {
  ErrorHandlers,
  ExceptionHandler,
} from '../../../shared/src/error/handler/abstract-error-handler';
import { IGNORE_LOGGING_KEY } from '../exception/abstract-server-exception';
import { ErrorOutDto } from '../dto/error-out.dto';

type LoggingErrorFormat = ErrorOutDto & {
  statusCode: number;
  session?: unknown;
  request?: unknown;
};

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
    @Inject(ErrorHandlers) private readonly errorHandlers: ExceptionHandler[],
  ) {}

  catch(exception: object, host: ArgumentsHost): void {
    // it is must be exist
    const handler = this.errorHandlers.find((it) => it.canHandle(exception));
    if (!handler) {
      // it never called
      return;
    }

    const responseEntity = handler.getErrorResponse(exception);

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const nodeEnv = process.env.NODE_ENV;

    // when production, remove error message
    const body =
      nodeEnv === 'production'
        ? {
            ...responseEntity,
            error: {
              ...responseEntity.error,
              message: undefined,
            },
          }
        : responseEntity;

    httpAdapter.reply(ctx.getResponse(), body, responseEntity.code);

    const log: LoggingErrorFormat = {
      ...responseEntity.error,
      statusCode: responseEntity.code,
    };

    if (
      IGNORE_LOGGING_KEY in exception &&
      exception[IGNORE_LOGGING_KEY] === true
    ) {
      Logger.debug(log);
      return;
    }

    Logger.error(log);
  }
}
