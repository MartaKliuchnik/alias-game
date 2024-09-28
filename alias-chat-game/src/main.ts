import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically strips unallowed properties
      forbidNonWhitelisted: true, // Throws an error for unallowed properties
      transform: false, // Transforms request payloads to match DTO types
    }),
  );

  // Enable CORS (if needed)
  app.enableCors();

  const port = configService.get<number>('APP_PORT', 3000);

  await app.listen(port);
}

bootstrap();
