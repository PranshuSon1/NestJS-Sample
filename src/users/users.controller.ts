import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Controller:
 * @Controller('users') maps HTTP requests starting with route prefix '/users' to methods within this class.
 * Responsible for handling incoming HTTP requests and returning responses.
 */
@Controller('users')
export class UsersController {
  // Inject UsersService via constructor injection
  constructor(private usersService: UsersService) {}

  /**
   * POST /users
   * Creates a new user record.
   * @Body() extracts and validates the request payload using CreateUserDto.
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    // Exclude password field from HTTP response
    const { password, ...result } = user.toObject();
    return result;
  }

  /**
   * GET /users/profile
   * Returns current authenticated user profile.
   * @UseGuards(JwtAuthGuard): Protects endpoint requiring a valid JWT Bearer token in the Authorization header.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    // req.user is populated by JwtStrategy.validate() after token verification
    return this.usersService.findById(req.user.userId);
  }

  /**
   * GET /users
   * Retrieves a list of all registered users (Protected Route).
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}

