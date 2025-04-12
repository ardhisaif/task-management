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
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from '../users/user.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @Roles('admin', 'user')
  async create(
    @Body() taskData: Partial<Task>,
    @Request() req: { user: { userId: number } },
  ): Promise<Task> {
    const user = await this.userService.findOne(req.user.userId);

    // Set the user for the task
    taskData.user = user;

    return this.taskService.create(taskData, user);
  }

  @Get()
  async findAll(
    @Request() req: { user: { userId: number; role: string } },
    @Query('userId') userId?: string,
  ): Promise<Task[]> {
    // If user is not admin, they can only see their own tasks
    if (req.user.role !== 'admin') {
      return this.taskService.findByUser(req.user.userId);
    }

    // Admin can see all tasks or filter by userId
    if (userId) {
      return this.taskService.findByUser(parseInt(userId, 10));
    }
    return this.taskService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { userId: number; role: string } },
  ): Promise<Task> {
    const task = await this.taskService.findOne(id);

    // If user is not admin and not the task owner, deny access
    if (req.user.role !== 'admin' && task.user.id !== req.user.userId) {
      throw new UnauthorizedException('You can only view your own tasks');
    }

    return task;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskData: Partial<Task>,
    @Request() req: { user: { userId: number; role: string } },
  ): Promise<Task> {
    const task = await this.taskService.findOne(id);
    const user = await this.userService.findOne(req.user.userId);

    // Only the task owner or an admin can update the task
    if (req.user.role !== 'admin' && task.user.id !== req.user.userId) {
      throw new UnauthorizedException('You can only update your own tasks');
    }

    return this.taskService.update(id, taskData, user);
  }

  @Patch(':id/toggle-completion')
  async toggleTaskCompletion(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { userId: number; role: string } },
  ): Promise<Task> {
    const task = await this.taskService.findOne(id);
    const user = await this.userService.findOne(req.user.userId);

    // Only the task owner or an admin can toggle completion
    if (req.user.role !== 'admin' && task.user.id !== req.user.userId) {
      throw new UnauthorizedException('You can only modify your own tasks');
    }

    return this.taskService.update(id, { completed: !task.completed }, user);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { userId: number } },
  ): Promise<{ message: string }> {
    const user = await this.userService.findOne(req.user.userId);
    await this.taskService.remove(id, user);
    return { message: 'Task deleted successfully' };
  }
}
