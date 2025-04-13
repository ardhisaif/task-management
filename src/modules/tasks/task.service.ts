import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';
import { TaskLogService } from '../task-logs/task-log.service';
import { QuoteService } from '../external/quote.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private taskLogService: TaskLogService,
    private quoteService: QuoteService,
  ) {}

  async create(
    taskData: Partial<Task> & { userId?: number },
    currentUser?: User,
  ): Promise<Task> {
    // Check if neither user object nor userId is provided
    if (!taskData.user && !taskData.userId) {
      throw new Error('User ID is required');
    }

    // If userId is provided, fetch the user entity
    if (taskData.userId) {
      const user = await this.userRepository.findOneBy({
        id: taskData.userId,
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${taskData.userId} not found`,
        );
      }

      taskData.user = user;
      delete taskData.userId; // Remove userId as we now have the user object
    }

    // Fetch a motivational quote if not already provided
    if (!taskData.quotes) {
      try {
        const quote = await this.quoteService.getRandomQuote();
        if (quote) {
          taskData.quotes = quote;
        }
      } catch {
        // Continue even if quote fetching fails
      }
    }

    const task = this.taskRepository.create(taskData);
    const savedTask = await this.taskRepository.save(task);

    // Create a log entry for task creation using the TaskLogService
    await this.taskLogService.create(
      savedTask,
      'TASK_CREATED',
      currentUser,
      undefined,
      {
        title: savedTask.title,
        description: savedTask.description,
        quotes: savedTask.quotes,
        userId: savedTask.user.id,
      },
    );

    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      where: { isDeleted: false },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async findByUser(userId: number): Promise<Task[]> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.taskRepository.find({
      where: {
        user: { id: userId },
        isDeleted: false,
      },
    });
  }

  async update(
    id: number,
    taskData: Partial<Task>,
    currentUser?: User,
  ): Promise<Task> {
    const task = await this.findOne(id);

    // Store previous values for audit log
    const previousValues = {
      title: task.title,
      description: task.description,
      completed: task.completed,
    };

    // Update task with new data
    Object.assign(task, taskData);

    const updatedTask = await this.taskRepository.save(task);

    // Determine the action type
    let action: 'TASK_UPDATED' | 'TASK_COMPLETED' | 'TASK_REOPENED' =
      'TASK_UPDATED';

    if (
      taskData.completed !== undefined &&
      previousValues.completed !== taskData.completed
    ) {
      action = taskData.completed ? 'TASK_COMPLETED' : 'TASK_REOPENED';
    }

    // Log the action using TaskLogService
    await this.taskLogService.create(
      updatedTask,
      action,
      currentUser,
      previousValues,
      {
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.completed,
      },
    );

    return updatedTask;
  }

  async remove(id: number, currentUser?: User): Promise<void> {
    const task = await this.findOne(id);

    task.isDeleted = true;
    await this.taskRepository.save(task);

    // Log the task deletion using TaskLogService
    await this.taskLogService.create(
      task,
      'TASK_DELETED',
      currentUser,
      {
        title: task.title,
        description: task.description,
        completed: task.completed,
      },
      undefined,
    );
  }

  async toggleCompletion(id: number, currentUser?: User): Promise<Task> {
    const task = await this.findOne(id);
    return this.update(id, { completed: !task.completed }, currentUser);
  }
}
