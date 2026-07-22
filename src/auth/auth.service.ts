import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/schemas/user.schema';

/**
 * AuthService:
 * Encapsulates authentication logic: validating credentials, checking password hashes,
 * and generating JWT (JSON Web Tokens) for client authorization.
 */
@Injectable()
export class AuthService {
  // Inject UsersService (from UsersModule) and JwtService (from JwtModule)
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Helper method to validate user credentials by checking email and comparing password hash.
   */
  async validateUser(email: string, password: string): Promise<Omit<UserDocument, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isPasswordMatching = await this.usersService.comparePassword(password, user.password);
    if (!isPasswordMatching) return null;
    const { password: _pwd, ...result } = user.toObject();
    return result as Omit<UserDocument, 'password'>;
  }

  /**
   * Handles user login: verifies email and password, constructs JWT payload, and returns access_token.
   */
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Throws HTTP 401 Unauthorized
    }

    const isPasswordMatching = await this.usersService.comparePassword(loginDto.password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Standard JWT Payload structure: 'sub' (subject) represents the unique User ID
    const payload = { email: user.email, sub: user._id.toString() };

    return {
      access_token: this.jwtService.sign(payload), // Signs payload with JWT secret and expiration
    };
  }
}

