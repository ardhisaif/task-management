import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Register the HTTP exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable global serialization interceptor and logging interceptor
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggingInterceptor(),
  );

  // Cek koneksi database
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    logger.log('Database connection is established successfully.');
  } else {
    logger.error('Database connection is not established.');
  }

  await app.listen(process.env.PORT ?? 3000);
  logger.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}
void bootstrap();
