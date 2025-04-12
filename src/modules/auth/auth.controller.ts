import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { User } from '../users/user.entity'; // Adjust the path based on your project structure
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
}
