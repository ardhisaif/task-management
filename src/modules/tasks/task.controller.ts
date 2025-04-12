import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('tasks')
@UseGuards(RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles('admin', 'user')
  create(@Body() taskData: Partial<Task>): Promise<Task> {
    return this.taskService.create(taskData);
  }

  @Get()
  findAll(@Query('userId') userId?: string): Promise<Task[]> {
    if (userId) {
      return this.taskService.findByUser(parseInt(userId, 10));
    }
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskData: Partial<Task>,
  ): Promise<Task> {
    return this.taskService.update(id, taskData);
  }

  @Patch(':id/toggle-completion')
  async toggleTaskCompletion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    const task = await this.taskService.findOne(id);
    return this.taskService.update(id, { completed: !task.completed });
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.remove(id);
  }
}
