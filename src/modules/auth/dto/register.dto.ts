import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    description: 'User username',
    example: '@haris.dev',
  })
  @IsString()
  @IsNotEmpty({ message: 'username is Required' })
  userName!: string;

  @ApiProperty({
    description: 'User full name',
    example: 'Muhammad Haris',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: 'User email Address',
    example: 'haris.dev@gmail.com',
  })
  @IsEmail({}, { message: 'Please provide a valide Email adress' })
  @IsNotEmpty({ message: 'Email is Required' })
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'Strong@password',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is Required' })
  @MinLength(8, { message: 'password must be 8 charachter long' })
  password!: string;
}
