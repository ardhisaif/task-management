import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { TaskLogService } from './task-log.service';
import { TaskLog, TaskAction } from '../../entities/task-log.entity';

@Controller('task-logs')
export class TaskLogController {
  constructor(private readonly taskLogService: TaskLogService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('taskId') taskId?: number,
    @Query('userId') userId?: number,
    @Query('action') action?: TaskAction,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: {
      taskId?: number;
      userId?: number;
      action?: TaskAction;
      startDate?: Date;
      endDate?: Date;
    } = {};

    if (taskId) filters.taskId = taskId;
    if (userId) filters.userId = userId;
    if (action) filters.action = action;

    if (startDate && endDate) {
      filters.startDate = new Date(startDate);
      filters.endDate = new Date(endDate);
    }

    return this.taskLogService.findAll(page, limit, filters);
  }

  @Get('task/:taskId')
  findByTaskId(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<TaskLog[]> {
    return this.taskLogService.findByTaskId(taskId);
  }

  @Post('mark-viewed')
  async markAsViewed(
    @Body() data: { logIds: number[] },
  ): Promise<{ success: boolean }> {
    await this.taskLogService.markAsViewed(data.logIds);
    return { success: true };
  }
}
