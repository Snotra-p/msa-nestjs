import { NestFactory } from '@nestjs/core';
import { setGlobalErrorMap } from '@libs/core/utils/setup-error';
import { setup } from '@libs/core/utils/setup';

// eslint-disable-next-line import/order
import { EVENT_SERVER_ERROR } from './error/event-server-error';

setGlobalErrorMap(EVENT_SERVER_ERROR);
import { EventServerModule } from './event-server.module';

async function bootstrap() {
  const app = await NestFactory.create(EventServerModule);

  setup(app, 'Event Server', 'Event Server API');

  await app.listen(process.env.PORT ?? 3002);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
