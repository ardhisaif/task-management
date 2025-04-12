import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { TaskLog } from '../../entities/task-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, TaskLog])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
