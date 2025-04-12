import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { TaskLogModule } from '../task-logs/task-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), TaskLogModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
