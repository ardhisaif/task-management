import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The username for login',
    example: 'ahmad',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password for login',
    example: 'rahasia123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
