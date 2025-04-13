import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Set log levels
  const logger = new Logger('Bootstrap');

  // Create app
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'], // Tambahkan 'verbose' untuk log lebih detail
  });

  // Enable validation pipe with detailed error messages
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false, // Make sure this is false to see detailed error messages
    }),
  );

  // Setup Swagger documentation
  const options = new DocumentBuilder()
    .setTitle('Task Management System API')
    .setDescription(
      'RESTful API for managing tasks with JWT authentication, role-based access, and audit logging',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('tasks', 'Task operations')
    .addTag('task-logs', 'Audit logging')
    .addTag('health', 'System health checks')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This is a key to be used in @ApiBearerAuth() decorator
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

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
  logger.log(
    `Swagger documentation available at: http://localhost:${process.env.PORT ?? 3000}/api-docs`,
  );
}
void bootstrap();
