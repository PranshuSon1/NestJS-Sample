import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

/**
 * AuthModule:
 * Organizes authentication components and configures JWT token creation and Passport integration.
 */
@Module({
  imports: [
    ConfigModule,
    UsersModule, // Import UsersModule to inject UsersService into AuthService & JwtStrategy
    PassportModule,

    // JwtModule.registerAsync: Asynchronously registers JwtService with dynamic config from ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'topSecret51'),
        signOptions: { expiresIn: '1h' }, // JWT tokens expire in 1 hour
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy], // Register AuthService and Passport JwtStrategy as providers
  controllers: [AuthController],
})
export class AuthModule {}

