import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './modules/tasks/task.module';
import { UserModule } from './modules/users/user.module';
import { TaskLogModule } from './modules/task-logs/task-log.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Jangan gunakan di production
    }),
    TaskModule,
    UserModule,
    TaskLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
