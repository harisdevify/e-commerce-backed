import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums.js';

export class AuthResponseDTO {
  @ApiProperty({
    description: 'Access token for authentication',
    example:
      '932c0935b3cc0ecec2f10840b56f6368ceff48757d7b423a0ee5a5ea81af90b9f4c5990fbf1a2c47f5fe41d2a9a2bc1b45436a496434febe',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh token for obtaining new access token',
    example:
      '932c0935b3cc0ecec2f10840b56f6368ceff48757d7b423a0ee5a5ea81af90b9f4c5990fbf1a2c47f5fe41d2a9a2bc1b45436a496434febe932c0935b3cc0ecec2f10840b56f6368ceff48757d7b423a0ee5a5ea81af90b9f4c5990fbf1a2c47f5fe41d2a9a2bc1b45436a496434febe',
  })
  refreshToken!: string;

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
