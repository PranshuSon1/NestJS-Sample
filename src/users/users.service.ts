import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

/**
 * Service (Provider):
 * @Injectable() marks this class as a provider that can be managed by the NestJS Dependency Injection (DI) container.
 * Encapsulates business logic and database interactions.
 */
@Injectable()
export class UsersService {
  // @InjectModel: Injects the Mongoose Model instance into this service via constructor DI
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Creates a new user record with a hashed password.
   */
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Hash password with bcrypt (salt rounds = 10) before persisting to DB
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  /**
   * Retrieves all users excluding the password field.
   */
  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  /**
   * Finds a user document by email (includes password for auth verification).
   */
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Finds a user document by ID or throws HTTP 404 (NotFoundException).
   */
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Helper method to compare plain password against stored bcrypt hash.
   */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

