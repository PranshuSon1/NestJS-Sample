import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO):
 * Defines the schema/shape of data sent over the network for user creation.
 * Used by NestJS ValidationPipe to enforce data contracts and strip unexpected fields.
 */
export class CreateUserDto {
  @IsNotEmpty() // Ensures the field is present and not an empty string/null
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail() // Validates proper email format
  email: string;

  @IsNotEmpty()
  @MinLength(6) // Enforces minimum string length of 6 characters
  password: string;
}

