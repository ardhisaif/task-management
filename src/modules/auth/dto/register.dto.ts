import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'The username for registration',
    example: 'ahmad',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The email address for registration',
    example: 'ahmad@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for registration',
    example: 'rahasia123',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
