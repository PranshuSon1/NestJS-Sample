import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

/**
 * Root Module (AppModule):
 * The starting point of the NestJS application dependency graph.
 * Organizes feature modules and configures global database/environment settings.
 */
@Module({
  imports: [
    // ConfigModule: Loads .env variables; isGlobal: true makes ConfigService available everywhere without re-importing
    ConfigModule.forRoot({ isGlobal: true }),

    // MongooseModule.forRootAsync: Asynchronously configures MongoDB connection using environment configuration
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // Inject ConfigService into the factory provider
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/nest-demo'),
      }),
    }),

    // Feature Modules: Modular domain boundaries encapsulating specific functionality
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}

