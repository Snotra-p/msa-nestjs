import { NestFactory } from '@nestjs/core';
import { setup } from '@libs/core/utils/setup';
import { setGlobalErrorMap } from '@libs/core/utils/setup-error';
import { HTTP_SERVICE_ERROR } from '@libs/shared/error/http-service-error';

setGlobalErrorMap(HTTP_SERVICE_ERROR);

import { GatewayServerModule } from './gateway-server.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServerModule);

  setup(app, 'Gateway Server', 'Gateway Server API');

  await app.listen(process.env.port ?? 3001);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
