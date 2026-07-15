# NestJS Backend Demo

A NestJS backend starter project demonstrating key backend concepts:

- MongoDB integration via `@nestjs/mongoose` and `mongoose`
- JWT authentication with `@nestjs/jwt` and Passport
- DTOs, validation, and global request validation pipe
- Password hashing with `bcrypt`
- Module-based architecture, controllers, services, and providers
- Environment-based configuration with `@nestjs/config`

## Project structure

- `src/main.ts` - starting point, initializes Nest application and global pipes
- `src/app.module.ts` - root module imports shared modules and database setup
- `src/auth` - authentication module, controller, service, JWT strategy, and guards
- `src/users` - user module, controller, service, DTOs, and MongoDB schema

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust values.
3. Start MongoDB locally or use a MongoDB Atlas URI.
4. Start the app:
   ```bash
   npm run start:dev
   ```
5. Open `http://localhost:3000` and call endpoints.

## Endpoints

- `POST /users` - create a new user
- `POST /auth/login` - login and get a JWT token
- `GET /users/profile` - get user profile (requires `Authorization: Bearer <token>`)
- `GET /users` - list all users (protected route)

## Important backend concepts

### MongoDB

Nest integrates MongoDB with `@nestjs/mongoose`. Schemas are defined using decorated classes, and models are injected in services via `@InjectModel`.

### JWT authentication

JWT is used to sign short-lived access tokens. The token is validated by a Passport strategy on protected routes.

### Validation and security

`class-validator` runs DTO validation on incoming requests. `ValidationPipe` enforces rules, automatically transforms payloads, and filters unwanted fields.

### Dependency injection and modularity

Nest modules group related controllers and providers. Services are injected through constructors for clean separation of concerns.

## Notes

This demo is intended as a learning example. In production, add stronger password policies, refresh tokens, rate limiting, and role-based access control.
