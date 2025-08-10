import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './auth/common/guards/at.guard';
import * as bodyParser from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new AtGuard(reflector))
  await app.listen(3333);
  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));


}
bootstrap();
