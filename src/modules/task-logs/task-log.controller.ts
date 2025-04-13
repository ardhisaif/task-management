import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TaskLogService } from './task-log.service';
import { TaskLog, TaskAction } from './task-log.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('task-logs')
@ApiBearerAuth('JWT-auth')
@Controller('task-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskLogController {
  constructor(private readonly taskLogService: TaskLogService) {}

  @ApiOperation({ summary: 'Get all task logs with pagination and filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 20,
  })
  @ApiQuery({
    name: 'taskId',
    required: false,
    type: Number,
    description: 'Filter by task ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'action',
    required: false,
    enum: [
      'TASK_CREATED',
      'TASK_UPDATED',
      'TASK_COMPLETED',
      'TASK_REOPENED',
      'TASK_DELETED',
    ],
    description: 'Filter by action type',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date (ISO format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date (ISO format)',
  })
  @ApiResponse({
    status: 200,
    description: 'Return task logs with pagination metadata',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
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

  @ApiOperation({ summary: 'Get logs for a specific task' })
  @ApiParam({ name: 'taskId', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Return logs for the specified task',
    type: [TaskLog],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @Get('task/:taskId')
  findByTaskId(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<TaskLog[]> {
    return this.taskLogService.findByTaskId(taskId);
  }

  @ApiOperation({ summary: 'Mark logs as viewed' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of log IDs to mark as viewed',
          example: [1, 2, 3],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Logs marked as viewed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @Post('mark-viewed')
  async markAsViewed(
    @Body() data: { logIds: number[] },
  ): Promise<{ success: boolean }> {
    await this.taskLogService.markAsViewed(data.logIds);
    return { success: true };
  }
}
