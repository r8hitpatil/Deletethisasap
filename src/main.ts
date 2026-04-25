import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AllExceptionFilter } from './common/filters/allExceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    whitelist : true,
    transform: true
  }));
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(process.env.PORT!);
}
bootstrap().catch(err => {
  console.error('Failed to start application :',err);
  process.exit(1);
});
