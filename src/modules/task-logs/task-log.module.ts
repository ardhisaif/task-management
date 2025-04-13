import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLogController } from './task-log.controller';
import { TaskLogService } from './task-log.service';
import { TaskLog } from './task-log.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskLog]),
    AuthModule, // Add this line to import AuthModule
  ],
  controllers: [TaskLogController],
  providers: [TaskLogService],
  exports: [TaskLogService],
})
export class TaskLogModule {}
