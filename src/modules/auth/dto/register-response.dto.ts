import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums.js';

export class RegisterResponseDTO {
  @ApiProperty({
    description: 'Authentication user info',
    example: {
      id: 'user-123',
      email: '<EMAIL>',
      fullName: 'Muhammad haris',
      userName: 'user.dev',
      role: 'USER',
    },
  })
  user!: {
    id: string;
    userName: string;
    fullName: string | null;
    email: string;
    role: Role;
  };
}
