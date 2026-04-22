import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateAdmin(loginDto.username, loginDto.pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials or not an admin');
    }
    return this.authService.login(user);
  }
}
