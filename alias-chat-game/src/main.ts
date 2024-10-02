import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Set global API prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Enable validation with whitelisting and forbidding non-whitelisted properties
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS (if needed)
  app.enableCors();

  const port = configService.get<number>('APP_PORT') || 4000;
  await app.listen(port);
}

bootstrap();
