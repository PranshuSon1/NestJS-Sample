# Top NestJS Interview Questions & Detailed Answers

Welcome to the **NestJS Master Interview Guide**. This document contains the most frequently asked NestJS interview questions ranging from fundamental concepts to advanced architectural patterns, accompanied by detailed explanations, diagrams, and real-world code snippets referencing this sample repository.

---

## Table of Contents

- [Section 1: Core Fundamentals & Architecture](#section-1-core-fundamentals--architecture)
  - [Q1: What is NestJS and why would you choose it over plain Express or Fastify?](#q1-what-is-nestjs-and-why-would-you-choose-it-over-plain-express-or-fastify)
  - [Q2: What is the role of `@Module()` metadata (`imports`, `controllers`, `providers`, `exports`)?](#q2-what-is-the-role-of-module-metadata-imports-controllers-providers-exports)
  - [Q3: How does Dependency Injection (DI) and Inversion of Control (IoC) work in NestJS?](#q3-how-does-dependency-injection-di-and-inversion-of-control-ioc-work-in-nestjs)
  - [Q4: What is the difference between a Controller, a Service, and a Provider?](#q4-what-is-the-difference-between-a-controller-a-service-and-a-provider)
- [Section 2: Request Lifecycle & Pipelines](#section-2-request-lifecycle--pipelines)
  - [Q5: What is the exact execution order of a request in NestJS?](#q5-what-is-the-exact-execution-order-of-a-request-in-nestjs)
  - [Q6: What is a DTO and how does `ValidationPipe` sanitize payloads?](#q6-what-is-a-dto-and-how-does-validationpipe-sanitize-payloads)
  - [Q7: What is the difference between Middleware, Guards, Interceptors, and Pipes?](#q7-what-is-the-difference-between-middleware-guards-interceptors-and-pipes)
  - [Q8: How do Exception Filters handle custom errors in NestJS?](#q8-how-do-exception-filters-handle-custom-errors-in-nestjs)
- [Section 3: Advanced Concepts & Custom Providers](#section-3-advanced-concepts--custom-providers)
  - [Q9: What are Provider Scopes (`DEFAULT`, `REQUEST`, `TRANSIENT`) and what are their performance impacts?](#q9-what-are-provider-scopes-default-request-transient-and-what-are-their-performance-impacts)
  - [Q10: What are Custom Providers (`useValue`, `useClass`, `useFactory`) and when do you use them?](#q10-what-are-custom-providers-usevalue-useclass-usefactory-and-when-do-you-use-them)
  - [Q11: What are Dynamic Modules (`forRoot`, `registerAsync`)?](#q11-what-are-dynamic-modules-forroot-registerasync)
  - [Q12: How do you solve Circular Dependencies in NestJS using `forwardRef()`?](#q12-how-do-you-solve-circular-dependencies-in-nestjs-using-forwardref)
- [Section 4: Database, Auth & Security](#section-4-database-auth--security)
  - [Q13: How does Mongoose schema integration work in NestJS?](#q13-how-does-mongoose-schema-integration-work-in-nestjs)
  - [Q14: How does JWT Authentication with Passport work in NestJS?](#q14-how-does-jwt-authentication-with-passport-work-in-nestjs)
  - [Q15: How do you implement Role-Based Access Control (RBAC) with Custom Decorators & Guards?](#q15-how-do-you-implement-role-based-access-control-rbac-with-custom-decorators--guards)

---

## Section 1: Core Fundamentals & Architecture

### Q1: What is NestJS and why would you choose it over plain Express or Fastify?

**Answer:**
NestJS is a TypeScript-first Node.js framework designed for building scalable, maintainable enterprise backends. While Express and Fastify are unopinionated HTTP routing libraries, NestJS provides a **structured architectural blueprint** heavily inspired by Angular.

#### Key Comparison:

| Feature | Express / Fastify | NestJS |
| :--- | :--- | :--- |
| **Architecture** | Unopinionated (dev designs structure) | Highly structured (Modules, Services, Controllers) |
| **Language** | JavaScript (TypeScript optional) | TypeScript native with decorator support |
| **Dependency Injection**| Manual wiring or 3rd party libraries | Built-in IoC container |
| **Validation / DTOs** | Custom middleware setup required | Declarative validation via `class-validator` & Pipes |
| **Underlying Engine** | Monolithic framework | Abstraction over Express or Fastify |

---

### Q2: What is the role of `@Module()` metadata (`imports`, `controllers`, `providers`, `exports`)?

**Answer:**
A module is a class decorated with `@Module()`. It organizes related features into domain boundaries and tells Nest how to assemble the application container.

#### Metadata Breakdown:
1. **`imports`**: Array of other modules whose exported providers are required by this module.
2. **`controllers`**: Array of controllers defined in this module to be instantiated by Nest.
3. **`providers`**: Array of services/providers instantiated by Nest DI container and available within this module.
4. **`exports`**: Array of providers to export so importing modules can inject them.

#### Code Example (from [users.module.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/users.module.ts#L7-L15)):
```typescript
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Allows AuthModule to inject UsersService
})
export class UsersModule {}
```

---

### Q3: How does Dependency Injection (DI) and Inversion of Control (IoC) work in NestJS?

**Answer:**
**Inversion of Control (IoC)** means the framework (NestJS), rather than your application code, controls the lifecycle and instantiation of classes.

**Dependency Injection (DI)** is the pattern used to implement IoC. Instead of manually creating instances with `new UsersService()`, you declare dependencies in constructor signatures:

```typescript
@Controller('users')
export class UsersController {
  // Nest's DI engine automatically injects the single shared instance of UsersService
  constructor(private readonly usersService: UsersService) {}
}
```

#### How Nest Resolves Dependencies:
1. Nest reads constructor parameters using TypeScript reflection (`reflect-metadata`).
2. It looks up the token (`UsersService`) in its internal IoC container.
3. If an instance already exists, it injects it; otherwise, it creates it, caches it (Singleton), and injects it.

---

### Q4: What is the difference between a Controller, a Service, and a Provider?

**Answer:**
- **Controller (`@Controller`)**: Responsible only for handling incoming HTTP requests, extracting route parameters/bodies, and returning HTTP responses to clients.
- **Service (`@Injectable`)**: Responsible for business logic, database queries, calculations, and external API calls.
- **Provider**: Any class decorated with `@Injectable()` managed by the DI container. Services, Repositories, Helpers, Guards, Strategies, and Interceptors are all Providers.

---

## Section 2: Request Lifecycle & Pipelines

### Q5: What is the exact execution order of a request in NestJS?

**Answer:**
When an incoming HTTP request hits a NestJS server, it travels through pipeline components in a strict sequential order:

```text
1. Global & Route Middleware (e.g. CORS, Body Parser, Logging)
      │
      ▼
2. Guards (e.g. JwtAuthGuard - checks permissions/authentication)
      │
      ▼
3. Pre-Controller Interceptors (e.g. Caching, Request metrics)
      │
      ▼
4. Pipes (e.g. ValidationPipe - parses and validates request payload)
      │
      ▼
5. Controller Route Handler (Invokes Service business logic)
      │
      ▼
6. Post-Controller Interceptors (Transforms outgoing response body)
      │
      ▼
7. Exception Filters (Catches uncaught HTTP exceptions & formats error JSON)
```

---

### Q6: What is a DTO and how does `ValidationPipe` sanitize payloads?

**Answer:**
A **DTO (Data Transfer Object)** is a TypeScript class defining the shape of incoming network payloads.

`ValidationPipe` uses metadata annotations from `class-validator` to automatically validate payloads.

#### Code Example (from [create-user.dto.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/dto/create-user.dto.ts#L3-L16)):
```typescript
export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

#### Key `ValidationPipe` Configurations (from [main.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/main.ts#L7-L13)):
- **`whitelist: true`**: Removes properties that are not defined in the DTO class (prevents mass-assignment vulnerabilities).
- **`forbidNonWhitelisted: true`**: Rejects requests containing unknown fields with HTTP 400 Bad Request.
- **`transform: true`**: Automatically casts primitive JSON values to DTO types.

---

### Q7: What is the difference between Middleware, Guards, Interceptors, and Pipes?

**Answer:**

| Component | Stage in Lifecycle | Access to ExecutionContext? | Primary Use Cases |
| :--- | :--- | :--- | :--- |
| **Middleware** | Before Guards | No (Express `req, res, next`) | CORS, logging, raw body parsing |
| **Guards** | After Middleware | Yes | Authentication (JWT), Roles, ACL permissions |
| **Interceptors** | Before/After Handler | Yes (RxJS streams) | Logging execution time, response mapping, caching |
| **Pipes** | Just before Controller Handler | Yes | Payload validation (`class-validator`), Type transformation |

---

### Q8: How do Exception Filters handle custom errors in NestJS?

**Answer:**
Exception Filters catch uncaught exceptions thrown during request execution and format standard error responses.

#### Custom Exception Filter Example:
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```

---

## Section 3: Advanced Concepts & Custom Providers

### Q9: What are Provider Scopes (`DEFAULT`, `REQUEST`, `TRANSIENT`) and what are their performance impacts?

**Answer:**
By default, every provider in NestJS is a **Singleton**.

1. **`Scope.DEFAULT` (Singleton)**: One single instance shared across the entire application. Fastest and recommended for performance.
2. **`Scope.REQUEST`**: A new instance of the provider is created for every incoming HTTP request.
3. **`Scope.TRANSIENT`**: A new dedicated instance is created for every class that injects the provider.

> [!WARNING]
> **Performance Impact**: Using `Scope.REQUEST` bubbles up the injection tree! Any controller or service injecting a Request-scoped provider automatically becomes Request-scoped, causing increased garbage collection overhead and degraded performance under high traffic.

---

### Q10: What are Custom Providers (`useValue`, `useClass`, `useFactory`) and when do you use them?

**Answer:**
Standard syntax `providers: [UsersService]` is shorthand for `{ provide: UsersService, useClass: UsersService }`.

#### Custom Provider Types:
1. **`useValue`**: Useful for injecting constant values, mock object instances for unit tests, or external configurations.
2. **`useClass`**: Dynamically chooses a implementation class depending on environment (e.g. `MockAuthService` vs `AuthService`).
3. **`useFactory`**: Dynamically creates a provider instance using a factory function with injected dependencies.

#### Factory Provider Example (from [app.module.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/app.module.ts#L10-L16)):
```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
})
```

---

### Q11: What are Dynamic Modules (`forRoot`, `registerAsync`)?

**Answer:**
A **Dynamic Module** is a module whose metadata configuration is constructed dynamically at runtime when imported into another module.

- **`forRoot()` / `register()`**: Used for static setup (e.g., passing options synchronously).
- **`forRootAsync()` / `registerAsync()`**: Accepts asynchronous options (e.g., using factory functions to inject `ConfigService` for database URIs or JWT secrets).

#### Code Example (from [auth.module.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/auth.module.ts#L15-L22)):
```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1h' },
  }),
})
```

---

### Q12: How do you solve Circular Dependencies in NestJS using `forwardRef()`?

**Answer:**
A circular dependency occurs when Class A depends on Class B, and Class B depends on Class A (e.g. `UsersService` needing `AuthService`, and `AuthService` needing `UsersService`).

#### Solution:
Use `forwardRef()` on both ends of the dependency declaration:

```typescript
// In UsersService constructor
constructor(
  @Inject(forwardRef(() => AuthService))
  private authService: AuthService,
) {}

// In AuthService constructor
constructor(
  @Inject(forwardRef(() => UsersService))
  private usersService: UsersService,
) {}
```

---

## Section 4: Database, Auth & Security

### Q13: How does Mongoose schema integration work in NestJS?

**Answer:**
Nest provides `@nestjs/mongoose` to connect TypeScript classes to MongoDB documents.

1. **`@Schema({ timestamps: true })`**: Maps class to MongoDB collection.
2. **`@Prop()`**: Configures field rules (`required`, `unique`, `default`).
3. **`UserDocument`**: Intersection type combining TypeScript model and Mongoose `Document`.
4. **`@InjectModel(User.name)`**: Injects the Mongoose Model instance into services via constructor DI.

#### Code Reference:
- Schema: [user.schema.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/schemas/user.schema.ts#L6-L24)
- Model Injection: [users.service.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/users/users.service.ts#L10)

---

### Q14: How does JWT Authentication with Passport work in NestJS?

**Answer:**
1. **User Login (`POST /auth/login`)**: Client sends email & password. `AuthService.login()` validates credentials using `bcrypt.compare()` and creates a signed token via `JwtService.sign({ sub: user._id, email })`.
2. **Protected Request**: Client sends token in `Authorization: Bearer <TOKEN>` header.
3. **`JwtStrategy`**: Passport extracts token, verifies signature using `JWT_SECRET`, decodes payload, and passes it to `validate(payload)`.
4. **`JwtAuthGuard`**: Intercepts request before controller execution, triggering `JwtStrategy`. If valid, attaches result to `req.user`; otherwise throws HTTP 401 Unauthorized.

#### Code Reference:
- Auth Guard: [jwt-auth.guard.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/jwt-auth.guard.ts#L4-L5)
- Strategy: [jwt.strategy.ts](file:///c:/Users/Programming.com/Projects/NestJS-Sample/src/auth/jwt.strategy.ts#L6-L20)

---

### Q15: How do you implement Role-Based Access Control (RBAC) with Custom Decorators & Guards?

**Answer:**
RBAC restricts access to endpoints based on user roles (`admin`, `user`).

#### Step 1: Create a `@Roles()` Decorator using `SetMetadata`
```typescript
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

#### Step 2: Create a `RolesGuard` using `Reflector`
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

#### Step 3: Apply Guard to Controller Method
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin-panel')
getAdminData() {
  return { message: 'Welcome Admin' };
}
```
