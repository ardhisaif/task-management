import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLogController } from './task-log.controller';
import { TaskLogService } from './task-log.service';
import { TaskLog } from './task-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskLog])],
  controllers: [TaskLogController],
  providers: [TaskLogService],
  exports: [TaskLogService],
})
export class TaskLogModule {}
