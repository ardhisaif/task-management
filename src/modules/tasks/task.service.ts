import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';
import { TaskLog } from '../../entities/task-log.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TaskLog)
    private taskLogRepository: Repository<TaskLog>,
  ) {}

  async create(taskData: Partial<Task>): Promise<Task> {
    if (!taskData.user && !taskData.user) {
      throw new Error('User ID is required');
    }

    // If userId is provided instead of user object
    if (taskData.user && !taskData.user) {
      const user = await this.userRepository.findOneBy({
        id: taskData.user as number,
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${taskData.user as number} not found`,
        );
      }

      taskData.user = user;
      delete taskData.user; // Remove userId as we now have the user object
    }

    const task = this.taskRepository.create(taskData);
    const savedTask = await this.taskRepository.save(task);

    // Create a log entry for task creation
    const taskLog = this.taskLogRepository.create({
      task: savedTask,
      action: 'TASK_CREATED',
    });
    await this.taskLogRepository.save(taskLog);

    return savedTask;
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user', 'taskLogs'],
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
      where: { user: { id: userId } },
    });
  }

  async update(id: number, taskData: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id);
    const previousStatus = task.completed;

    // Update task with new data
    Object.assign(task, taskData);

    const updatedTask = await this.taskRepository.save(task);

    // Create a log if task status changed
    if (
      taskData.completed !== undefined &&
      previousStatus !== taskData.completed
    ) {
      const action = updatedTask.completed ? 'TASK_COMPLETED' : 'TASK_REOPENED';

      const taskLog = this.taskLogRepository.create({
        task: updatedTask,
        action,
      });
      await this.taskLogRepository.save(taskLog);
    }

    return updatedTask;
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);

    // Create a log entry before deleting
    const taskLog = this.taskLogRepository.create({
      task,
      action: 'TASK_DELETED',
    });
    await this.taskLogRepository.save(taskLog);

    await this.taskRepository.remove(task);
  }
}
