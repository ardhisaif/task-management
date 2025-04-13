import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Username', example: 'ahmad' })
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'ahmad@gmail.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: ['user', 'admin'],
  })
  @Column({ type: 'varchar', length: 50 })
  role: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Tasks belonging to this user',
    type: () => [Task],
  })
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
