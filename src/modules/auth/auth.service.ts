import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuthResponseDTO } from './dto/auth-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDTO } from './dto/register.dto.js';
@Injectable()
export class AuthService {
  private readonly SALT_ROUND = 12;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Register
  async register(registerDTO: RegisterDTO): Promise<AuthResponseDTO> {
    const { fullName, email, userName, password } = registerDTO;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exist');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          userName,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          userName: true,
          role: true,
          password: false,
        },
      });

      const token = await this.generateTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, token.refreshToken);
      return {
        ...token,
        user,
      };
    } catch (error) {
      console.error('Error during registeration: ', error);
      throw new InternalServerErrorException(
        'An Error occured during registeration',
      );
    }
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };
    const refreshId = randomBytes(16).toString('hex');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '15m' }),
      this.jwtService.signAsync(
        { ...payload, refreshId },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, this.SALT_ROUND);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async refreshTokens(userId: string): Promise<AuthResponseDTO> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        userName: true,
        role: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  // Login
  async login(loginDto: LoginDto): Promise<AuthResponseDTO> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  // Log out
  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
