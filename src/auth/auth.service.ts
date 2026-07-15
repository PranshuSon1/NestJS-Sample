import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<UserDocument, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isPasswordMatching = await this.usersService.comparePassword(password, user.password);
    if (!isPasswordMatching) return null;
    const { password: _pwd, ...result } = user.toObject();
    return result as Omit<UserDocument, 'password'>;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatching = await this.usersService.comparePassword(loginDto.password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
