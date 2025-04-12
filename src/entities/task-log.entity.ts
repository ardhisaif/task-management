import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('task_logs')
export class TaskLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.taskLogs, { onDelete: 'CASCADE' })
  task: Task;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
