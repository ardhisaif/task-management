import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { TaskLogModule } from '../task-logs/task-log.module';
import { UserModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { ExternalModule } from '../external/external.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
    TaskLogModule,
    UserModule,
    AuthModule,
    ExternalModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
