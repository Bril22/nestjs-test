import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCsrf from '@fastify/csrf-protection';
import secureSession from '@fastify/secure-session';
import { AppModule } from './app.module';
import { fastifyCookie } from '@fastify/cookie';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CsrfMiddleware } from './middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.register(fastifyCookie, {
    secret: 'my-secret',
  });

  app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 86400,
    },
  });

  app.register(fastifyCsrf, {
    sessionPlugin: '@fastify/secure-session',
    cookieKey: '_csrf',
    cookieOpts: {
      path: '/',
      httpOnly: true,
      secure: false,
    },
  });

  // app.use(new CsrfMiddleware().use);
  // test

  await app.listen(3333);
}
bootstrap();
