import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

/**
 * JwtStrategy:
 * Integrates Passport with NestJS to decode and verify JWT Bearer tokens in incoming HTTP Authorization headers.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    // Configure passport-jwt options: token extractor, expiration check, secret key
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract from "Authorization: Bearer <token>"
      ignoreExpiration: false, // Automatically reject expired tokens
      secretOrKey: process.env.JWT_SECRET || 'topSecret51',
    });
  }

  /**
   * Called automatically by Passport after the JWT is verified with secret key.
   * The object returned here is injected into the Express Request as `req.user`.
   */
  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findById(payload.sub);
    return { userId: payload.sub, email: payload.email, roles: user?.roles || [] };
  }
}

