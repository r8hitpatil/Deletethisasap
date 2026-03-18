import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log("ENV CHECK:", process.env.DATABASE_URL);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()) // class validation
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
