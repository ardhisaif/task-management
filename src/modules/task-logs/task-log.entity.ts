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

export type TaskAction =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_COMPLETED'
  | 'TASK_REOPENED'
  | 'TASK_DELETED';

@Entity()
export class TaskLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.taskLogs)
  @JoinColumn()
  task: Task;

  @Column()
  taskId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  userId: number;

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

  @Column({ type: 'jsonb', nullable: true })
  previousValues: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  newValues: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  viewed: boolean;
}
