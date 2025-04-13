import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export type TaskAction =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_COMPLETED'
  | 'TASK_REOPENED'
  | 'TASK_DELETED';

@Entity()
export class TaskLog {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Related task', type: () => Task })
  @ManyToOne(() => Task, (task) => task.taskLogs)
  @JoinColumn()
  task: Task;

  @ApiProperty({ description: 'Task ID', example: 1 })
  @Column()
  taskId: number;

  @ApiProperty({
    description: 'User who performed the action',
    type: () => User,
    nullable: true,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User;

  @ApiProperty({ description: 'User ID', example: 1, nullable: true })
  @Column({ nullable: true })
  userId: number;

  @ApiProperty({
    description: 'Action performed on the task',
    enum: [
      'TASK_CREATED',
      'TASK_UPDATED',
      'TASK_COMPLETED',
      'TASK_REOPENED',
      'TASK_DELETED',
    ],
    example: 'TASK_CREATED',
  })
  @Column({
    type: 'enum',
    enum: [
      'TASK_CREATED',
      'TASK_UPDATED',
      'TASK_COMPLETED',
      'TASK_REOPENED',
      'TASK_DELETED',
    ],
  })
  action: TaskAction;

  @ApiProperty({
    description: 'Previous values before the change',
    nullable: true,
    example: {
      title: 'Old title',
      description: 'Old description',
      completed: false,
    },
  })
  @Column({ type: 'jsonb', nullable: true })
  previousValues: Record<string, any>;

  @ApiProperty({
    description: 'New values after the change',
    nullable: true,
    example: {
      title: 'New title',
      description: 'New description',
      completed: true,
    },
  })
  @Column({ type: 'jsonb', nullable: true })
  newValues: Record<string, any>;

  @ApiProperty({ description: 'Timestamp when the action was performed' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Whether the log has been viewed',
    example: false,
    default: false,
  })
  @Column({ default: false })
  viewed: boolean;
}
