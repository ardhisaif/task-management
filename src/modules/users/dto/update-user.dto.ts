import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The username for the user',
    example: 'ahmad_updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'The email address for the user',
    example: 'john.updated@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The password for the user',
    example: 'newrahasia123',
    required: false,
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
    required: false,
    enum: ['user', 'admin'],
  })
  @IsOptional()
  @IsString()
  role?: string;
}
