import { AbstractServerException } from '@libs/core/exception/abstract-server-exception';

import { AUTH_SERVER_ERROR, AuthServerErrorKey } from './auth-server-error';

export class AuthServerException extends AbstractServerException<AuthServerErrorKey> {
  constructor(
    errorKey: AuthServerErrorKey,
    message?: string,
    ignoreLogging?: boolean,
  ) {
    super(errorKey, AUTH_SERVER_ERROR, message, ignoreLogging);
  }
}
