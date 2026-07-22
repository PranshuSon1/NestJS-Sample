import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * LoginDto:
 * Data Transfer Object for authentication request payloads (/auth/login).
 * Enforces email format and password length validation before controller execution.
 */
export class LoginDto {
  @IsEmail() // Verifies email formatting
  email: string;

  @IsNotEmpty()
  @MinLength(6) // Ensures password is at least 6 characters long
  password: string;
}

