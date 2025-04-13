import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username for the user',
    example: 'ahmad',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The email address for the user',
    example: 'ahmad@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user',
    example: 'rahasia123',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    default: 'user',
    enum: ['user', 'admin'],
  })
  @IsOptional()
  @IsString()
  role?: string;
}
