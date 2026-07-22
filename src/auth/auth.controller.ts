import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

/**
 * AuthController:
 * Handles incoming HTTP requests for authentication (route prefix '/auth').
 */
@Controller('auth')
export class AuthController {
  // Inject AuthService via constructor DI
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/login
   * Validates user credentials and returns a signed JWT access token.
   */
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

