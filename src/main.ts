import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger();

  const port = process.env.PORT;

  await app.listen(port ?? 3000);

  logger.log(`Server running at ${port ?? 3000}`);
}
bootstrap();
