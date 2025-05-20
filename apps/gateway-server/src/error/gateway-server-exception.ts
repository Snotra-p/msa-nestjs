import { AbstractServerException } from '@libs/core/exception/abstract-server-exception';

import {
  GATEWAY_SERVER_ERROR,
  GatewayServerErrorKey,
} from './gateway-server-error';

export class GatewayServerException extends AbstractServerException<GatewayServerErrorKey> {
  constructor(
    errorKey: GatewayServerErrorKey,
    message?: string,
    ignoreLogging?: boolean,
  ) {
    super(errorKey, GATEWAY_SERVER_ERROR, message, ignoreLogging);
  }
}
