import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { TaskLog } from '../task-logs/task-log.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tasks')
export class Task {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
  })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Write comprehensive documentation for the API endpoints',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Motivational quote',
    example: '"The secret of getting ahead is getting started." - Mark Twain',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  quotes: string;

  @ApiProperty({
    description: 'Task completion status',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @ApiProperty({
    description: 'Soft delete flag',
    example: false,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @ApiProperty({ description: 'User who owns the task', type: () => User })
  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({
    description: 'Task logs (audit trail)',
    type: () => [TaskLog],
  })
  @OneToMany(() => TaskLog, (taskLog) => taskLog.task)
  taskLogs: TaskLog[];

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
