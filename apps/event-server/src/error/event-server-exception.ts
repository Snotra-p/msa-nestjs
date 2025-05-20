import { AbstractServerException } from '@libs/core/exception/abstract-server-exception';

import { EVENT_SERVER_ERROR, EventServerErrorKey } from './event-server-error';

export class EventServerException extends AbstractServerException<EventServerErrorKey> {
  constructor(
    errorKey: EventServerErrorKey,
    message?: string,
    ignoreLogging?: boolean,
  ) {
    super(errorKey, EVENT_SERVER_ERROR, message, ignoreLogging);
  }
}
