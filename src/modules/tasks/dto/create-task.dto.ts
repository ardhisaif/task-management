import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project documentation',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The detailed description of the task',
    example: 'Write comprehensive documentation for the API endpoints',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description:
      'The motivational quote associated with the task (auto-populated if not provided)',
    required: false,
    example: '"The secret of getting ahead is getting started." - Mark Twain',
  })
  @IsOptional()
  @IsString()
  quotes?: string;

  @ApiProperty({
    description: 'The completion status of the task',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({
    description:
      'The ID of the user this task belongs to (only used for admin-created tasks)',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}
