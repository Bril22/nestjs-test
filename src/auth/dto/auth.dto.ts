import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'First name (not required)',
    example: 'John',
  })
  firstName?: string;

  @ApiProperty({
    description: 'Last name (not required)',
    example: 'Doe',
  })
  lastName?: string;
}

export class tokenDto {
  userId: number;
  email: string;
  exp?: number;
}

export class AuthResponse {
  access_token: string;
  message: string;
}
