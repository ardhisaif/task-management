import 'dotenv/config'; // Pastikan dotenv diimpor
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cek koneksi database
  const dataSource = app.get(DataSource);
  if (dataSource.isInitialized) {
    console.log('Database connection is established successfully.');
  } else {
    console.error('Database connection is not established.');
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
}
void bootstrap();
