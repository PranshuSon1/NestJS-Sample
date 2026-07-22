import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';

/**
 * UsersModule:
 * Encloses all User-related components (Schema, Controller, Service).
 * Registers Mongoose schema binding and exports UsersService for consumption by AuthModule.
 */
@Module({
  imports: [
    // MongooseModule.forFeature binds the User schema to the current module scope
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService], // Services/providers instantiated and managed within this module
  controllers: [UsersController], // Controllers attached to this module
  exports: [UsersService], // Export UsersService so other modules (like AuthModule) can inject it
})
export class UsersModule {}

