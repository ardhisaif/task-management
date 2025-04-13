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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @Post()
  @Roles('admin', 'user')
  async create(
    @Body() taskData: CreateTaskDto,
    @Request() req: { user: { userId: number } },
  ): Promise<Task> {
    const user = await this.userService.findOne(req.user.userId);

    // Set the user for the task
    return this.taskService.create({ ...taskData, user }, user);
  }

  @ApiOperation({
    summary: "Get all tasks (admin) or user's tasks (regular user)",
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: 'Filter tasks by user ID (admin only)',
  })
  @ApiResponse({ status: 200, description: 'Return all tasks', type: [Task] })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
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

  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Return the task', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the task owner' })
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

  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the task owner' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskData: UpdateTaskDto,
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

  @ApiOperation({ summary: 'Toggle task completion status' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: 200,
    description: 'Task completion status toggled',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the task owner' })
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

  @ApiOperation({ summary: 'Delete a task (soft delete)' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
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
