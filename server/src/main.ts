import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5173', 'https://atyourserv.byst.re/chat'],
    credentials: true,
  });

  const port = 9000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}
bootstrap();
