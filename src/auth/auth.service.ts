import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const { name, email, password } = registerDto;
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
        },
      });
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: user.id, name: user.name, email: user.email },
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const normalizedEmail = email.trim().toLowerCase();
      const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: user.id, name: user.name, email: user.email },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async createUser(registerDto: RegisterDto, adminEmail: string) {
    const normalizedEmail = registerDto.email.trim().toLowerCase();
    if (normalizedEmail === 'admin@gmail.com') {
      throw new ForbiddenException('Cannot create admin account');
    }
    const existingUser = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });
    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
  }

  async updateUser(id: number, updateDto: RegisterDto, adminEmail: string) {
    const normalizedEmail = updateDto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    if (user.email === 'admin@gmail.com') {
      throw new ForbiddenException('Cannot modify admin account');
    }
    if (normalizedEmail !== user.email) {
      const existingUser = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }
    const hashedPassword = await bcrypt.hash(updateDto.password, 10);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateDto.name,
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
    return updatedUser;
  }

  async deleteUser(id: number, adminEmail: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    if (user.email === 'admin@gmail.com') {
      throw new ForbiddenException('Cannot delete admin account');
    }
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}