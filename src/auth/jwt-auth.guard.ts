import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard:
 * A NestJS Guard that extends Passport's AuthGuard with the 'jwt' strategy name.
 * Attached to controllers or handler methods via @UseGuards(JwtAuthGuard) to protect routes.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

