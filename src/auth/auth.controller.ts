import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers() {
    return this.authService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.authService.getUserById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('users')
  async createUser(@Body() registerDto: RegisterDto, @Req() req) {
    return this.authService.createUser(registerDto, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateDto: RegisterDto, @Req() req) {
    return this.authService.updateUser(+id, updateDto, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Req() req) {
    return this.authService.deleteUser(+id, req.user.email);
  }
}