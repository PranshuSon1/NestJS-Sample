import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Bootstrap function: Entry point of every NestJS application.
 * Initializes NestFactory, configures global middleware/pipes, and listens on a port.
 */
async function bootstrap() {
  // NestFactory creates an instance of the application using the Root Module (AppModule)
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe: Automatically validates incoming HTTP request bodies/params against DTO schemas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips out properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are sent in payload
      transform: true, // Automatically converts incoming payload primitives to DTO types
    }),
  );

  // Start HTTP server listening on port 3000
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();

