import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerUiOptions } from '@nestjs/swagger/dist/interfaces/swagger-ui-options.interface';

// setGlobalErrorMap(AUTH_SERVER_ERROR);

export const setup = (
  app: INestApplication,
  title: string,
  describtion: string,
) => {
  const swaggerBuilder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(describtion)
    .addBearerAuth()
    .setVersion('1.0');

  const swaggerConfig = swaggerBuilder.build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    } as SwaggerUiOptions,
    customCss:
      '.swagger-ui .opblock .opblock-summary .view-line-link.copy-to-clipboard{display:flex; width:24px; margin: 0px 5px;}',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
};
