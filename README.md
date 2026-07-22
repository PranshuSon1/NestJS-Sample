# NestJS Masterclass & Learning Guide

Welcome to the **NestJS Learning Guide** built on top of this sample project! This guide is designed to help you master NestJS, its architecture, design patterns, and core concepts.

> 📚 **Interview Preparation**: Looking for common technical interview questions? Check out our dedicated [INTERVIEW_QUESTIONS.md](file:///c:/Users/Programming.com/Projects/NestJS-Sample/INTERVIEW_QUESTIONS.md) guide!

---

## Table of Contents

1. [What is NestJS?](#what-is-nestjs)
2. [Project Architecture & Directory Structure](#project-architecture--directory-structure)
3. [Core Concepts Deep Dive](#core-concepts-deep-dive)
   - [1. Modules (`@Module`)](#1-modules-module)
   - [2. Controllers (`@Controller`)](#2-controllers-controller)
   - [3. Providers & Services (`@Injectable`)](#3-providers--services-injectable)
   - [4. Dependency Injection (DI) Engine](#4-dependency-injection-di-engine)
   - [5. Data Transfer Objects (DTOs) & Validation Pipes](#5-data-transfer-objects-dtos--validation-pipes)
   - [6. Database Integration with Mongoose](#6-database-integration-with-mongoose)
   - [7. Authentication with Passport & JWT](#7-authentication-with-passport--jwt)
   - [8. Guards (`@UseGuards`)](#8-guards-useguards)
   - [9. Configuration Management (`ConfigModule`)](#9-configuration-management-configmodule)
4. [NestJS Request Lifecycle](#nestjs-request-lifecycle)
5. [Step-by-Step API Testing Guide](#step-by-step-api-testing-guide)

---

## What is NestJS?

**NestJS** is a progressive Node.js framework for building efficient, scalable, and enterprise-grade server-side applications. Built with and fully supporting **TypeScript**, it combines elements of Object Oriented Programming (OOP), Functional Programming (FP), and Functional Reactive Programming (FRP).

Under the hood, NestJS uses robust HTTP server frameworks like **Express** (default) or **Fastify**. It raises the abstraction level by providing an out-of-the-box architecture heavily inspired by **Angular**, solving the problem of unorganized, hard-to-maintain Node.js codebases.

---

## Project Architecture & Directory Structure

```text
src/
├── main.ts                   # Application entry point (bootstrap function & global pipes)
├── app.module.ts              # Root module configuring database & environment
├── auth/                      # Authentication Feature Module
│   ├── dto/
│   │   └── login.dto.ts       # DTO & validation rules for login payloads
│   ├── auth.controller.ts     # HTTP routes for authentication (/auth/login)
│   ├── auth.module.ts         # Configures JwtModule, Passport, and Auth providers
│   ├── auth.service.ts        # Business logic for login and token signing
│   ├── jwt.strategy.ts        # Passport strategy to verify Bearer JWT tokens
│   └── jwt-auth.guard.ts      # Guard to protect authenticated routes
└── users/                     # Users Feature Module
    ├── dto/
    │   └── create-user.dto.ts  # DTO & validation rules for user registration
    ├── schemas/
    │   └── user.schema.ts     # Mongoose database model & TypeScript interface
    ├── users.controller.ts    # HTTP routes for users (/users, /users/profile)
    ├── users.module.ts        # Encloses user schema, controller, and service
    └── users.service.ts       # Business logic for database queries & bcrypt hashing
```

---

## Core Concepts Deep Dive

### 1. Modules (`@Module`)

Modules are the foundational building blocks of NestJS. A module is a class annotated with the `@Module()` decorator, providing metadata that Nest uses to organize the application graph.

#### Key Properties of `@Module()` Metadata:
- **`imports`**: List of imported modules that export providers needed in this module.
- **`controllers`**: Set of controllers defined in this module which have to be instantiated.
- **`providers`**: Services, repositories, or strategies instantiated by the Nest DI container and shared at least across this module.
- **`exports`**: Subset of providers that this module provides and should be available in other modules.

#### Code Reference:
- Root Module: [app.module.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/app.module.ts#L7-L21)
- Feature Module: [users.module.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/users.module.ts#L7-L15)
- Feature Module: [auth.module.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/auth.module.ts#L10-L27)

---

### 2. Controllers (`@Controller`)

Controllers are responsible for handling incoming HTTP requests and returning responses to the client. Routing mechanism controls which controller receives which requests.

#### Decorators:
- `@Controller('path')`: Defines the base route prefix for all handlers in the class (e.g., `@Controller('users')`).
- Method Decorators: `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`.
- Request Data Decorators:
  - `@Body()` - Extracts the request body payload.
  - `@Param('id')` - Extracts route URL parameters.
  - `@Query('search')` - Extracts URL search query parameters.
  - `@Request()` / `@Req()` - Injects the underlying HTTP request object.

#### Code Reference:
- User Controller: [users.controller.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/users.controller.ts#L6-L28)
- Auth Controller: [auth.controller.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/auth.controller.ts#L5-L13)

---

### 3. Providers & Services (`@Injectable`)

Providers are plain TypeScript classes decorated with `@Injectable()`. The main idea of a provider is that it can be injected as a dependency into controllers or other services.

Services handle business logic, data access, third-party API integrations, and data manipulation, keeping controllers lean and focused strictly on HTTP handling.

#### Code Reference:
- User Service: [users.service.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/users.service.ts#L8-L38)
- Auth Service: [auth.service.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/auth.service.ts#L7-L37)

---

### 4. Dependency Injection (DI) Engine

NestJS is built around the **Inversion of Control (IoC)** design pattern. You declare dependencies in a class constructor, and Nest automatically resolves and injects instances at runtime.

```typescript
// Constructor Injection Example
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // NestJS automatically instantiates and supplies UsersService
}
```

If `UsersService` is exported by `UsersModule` and imported into `AuthModule`, Nest injects the single shared instance across modules (Singleton pattern).

---

### 5. Data Transfer Objects (DTOs) & Validation Pipes

A **DTO** is an object that defines how data will be sent over the network. It enforces a strict API contract between client and server.

Nest uses `class-validator` decorators on DTO fields and a global `ValidationPipe` in `main.ts` to automatically validate payloads before entering controller methods.

#### Benefits of `ValidationPipe`:
- **`whitelist: true`**: Strips any properties from the request body that are not defined in the DTO class.
- **`forbidNonWhitelisted: true`**: Throws an HTTP 400 error if unknown fields are provided.
- **`transform: true`**: Automatically converts primitive types (string to number, boolean, etc.) based on TypeScript type annotations.

#### Code Reference:
- Create User DTO: [create-user.dto.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/dto/create-user.dto.ts#L3-L16)
- Login DTO: [login.dto.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/dto/login.dto.ts#L3-L10)
- ValidationPipe Setup: [main.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/main.ts#L7-L13)

---

### 6. Database Integration with Mongoose

Nest integrates MongoDB using `@nestjs/mongoose`.

- **`@Schema({ timestamps: true })`**: Decorates a class to map it to a MongoDB collection.
- **`@Prop()`**: Configures collection field rules (required, unique, default values).
- **`SchemaFactory.createForClass(User)`**: Compiles the class into a Mongoose Schema.
- **`@InjectModel(User.name)`**: Injects the Mongoose Model into services.

#### Code Reference:
- User Schema: [user.schema.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/schemas/user.schema.ts#L6-L24)
- Injecting Model in Service: [users.service.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/users.service.ts#L10)

---

### 7. Authentication with Passport & JWT

Authentication verifies the identity of users.

1. **Password Hashing**: Passwords are hashed asynchronously with `bcrypt` before storing in MongoDB (`bcrypt.hash(password, 10)`).
2. **JWT Generation**: Upon successful login, `AuthService` signs a payload containing user ID (`sub`) and `email` using `JwtService.sign(payload)`.
3. **JWT Strategy**: `JwtStrategy` extends `PassportStrategy(Strategy)`. It extracts the Bearer token from the `Authorization` header, verifies its digital signature, and attaches the decoded payload to `req.user`.

#### Code Reference:
- JWT Strategy: [jwt.strategy.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/jwt.strategy.ts#L6-L20)
- Auth Service Login: [auth.service.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/auth.service.ts#L23-L36)

---

### 8. Guards (`@UseGuards`)

Guards are classes decorated with `@Injectable()` that implement `CanActivate`. They determine whether a given request should be handled by the route handler based on conditions like permissions, roles, or ACLs.

`JwtAuthGuard` extends Passport's built-in `AuthGuard('jwt')` to protect private endpoints.

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return this.usersService.findById(req.user.userId);
}
```

#### Code Reference:
- Guard Definition: [jwt-auth.guard.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/jwt-auth.guard.ts#L4-L5)
- Guard Usage on Controller: [users.controller.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/users.controller.ts#L17-L21)

---

### 9. Configuration Management (`ConfigModule`)

`ConfigModule` from `@nestjs/config` loads key-value pairs from `.env` files into Node's `process.env`. Using `ConfigService` provides typed, dynamic access to environment variables across the app.

#### Code Reference:
- Root Setup: [app.module.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/app.module.ts#L9-L16)

---

## NestJS Request Lifecycle

When an HTTP request enters the NestJS application, it flows sequentially through the following pipeline:

```text
Incoming HTTP Request
       │
       ▼
1. Middleware (e.g. CORS, Logger, Body Parser)
       │
       ▼
2. Guards (e.g. JwtAuthGuard checks token validity)
       │
       ▼
3. Interceptors (Pre-controller logic, tracing, caching)
       │
       ▼
4. Pipes (ValidationPipe transforms and validates DTO)
       │
       ▼
5. Controller Route Handler (Delegates work to Service)
       │
       ▼
6. Service / Database Layer (Mongoose query / Bcrypt)
       │
       ▼
7. Interceptors (Post-controller logic, payload mapping)
       │
       ▼
8. Exception Filters (Catches uncaught exceptions & formats HTTP error response)
       │
       ▼
Outgoing HTTP Response to Client
```

---

## Step-by-Step API Testing Guide

### 1. Prerequisites
- Ensure Node.js is installed.
- Ensure MongoDB is running locally on port 27017 or set `MONGODB_URI` in `.env`.

### 2. Running the Application
```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start development server with auto-reload
npm run start:dev
```

### 3. API Endpoint Verification

#### A. Register a New User (`POST /users`)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "secretPassword123"
  }'
```

#### B. Log In & Receive JWT (`POST /auth/login`)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secretPassword123"
  }'
```
*Expected Response:*
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### C. Get Authenticated Profile (`GET /users/profile`)
Replace `<TOKEN>` with your `access_token`:
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <TOKEN>"
```

#### D. List All Users (`GET /users`)
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <TOKEN>"
```
