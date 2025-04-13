import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Updated project documentation',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The detailed description of the task',
    example: 'Write comprehensive documentation with examples',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The completion status of the task',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
