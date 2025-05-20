import { NestFactory } from '@nestjs/core';
import { setup } from '@libs/core/utils/setup';
import { setGlobalErrorMap } from '@libs/core/utils/setup-error';

// eslint-disable-next-line import/order
import { AUTH_SERVER_ERROR } from './error/auth-server-error';

setGlobalErrorMap(AUTH_SERVER_ERROR);

import { AuthServerModule } from './auth-server.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServerModule);

  setup(app, 'Auth Server', 'Auth Server API');

  await app.listen(process.env.port ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
