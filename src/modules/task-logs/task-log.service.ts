import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { TaskLog, TaskAction } from '../../entities/task-log.entity';
import { Task } from '../../entities/task.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class TaskLogService {
  constructor(
    @InjectRepository(TaskLog)
    private taskLogRepository: Repository<TaskLog>,
  ) {}

  async create(
    task: Task,
    action: TaskAction,
    user?: User,
    previousValues?: Record<string, any>,
    newValues?: Record<string, any>,
  ): Promise<TaskLog> {
    const taskLog = this.taskLogRepository.create({
      task,
      action,
      user,
      previousValues,
      newValues,
    });

    return this.taskLogRepository.save(taskLog);
  }

  async findAll(
    page = 1,
    limit = 20,
    filters?: {
      taskId?: number;
      userId?: number;
      action?: TaskAction;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<{ logs: TaskLog[]; total: number }> {
    const queryBuilder = this.taskLogRepository
      .createQueryBuilder('taskLog')
      .leftJoinAndSelect('taskLog.task', 'task')
      .leftJoinAndSelect('taskLog.user', 'user')
      .orderBy('taskLog.createdAt', 'DESC');

    // Apply filters
    if (filters) {
      if (filters.taskId) {
        queryBuilder.andWhere('taskLog.taskId = :taskId', {
          taskId: filters.taskId,
        });
      }

      if (filters.userId) {
        queryBuilder.andWhere('taskLog.userId = :userId', {
          userId: filters.userId,
        });
      }

      if (filters.action) {
        queryBuilder.andWhere('taskLog.action = :action', {
          action: filters.action,
        });
      }

      if (filters.startDate && filters.endDate) {
        queryBuilder.andWhere(
          'taskLog.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
        );
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const logs = await queryBuilder.skip(skip).take(limit).getMany();

    return { logs, total };
  }

  async findByTaskId(taskId: number): Promise<TaskLog[]> {
    return this.taskLogRepository.find({
      where: { taskId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsViewed(logIds: number[]): Promise<void> {
    await this.taskLogRepository.update({ id: In(logIds) }, { viewed: true });
  }
}
