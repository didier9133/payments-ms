import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './configs/envs';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('payments-ms');
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice(
    {
      transport: Transport.NATS,
      options: {
        servers: envs.SERVERS_NATS,
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  await app.startAllMicroservices();

  await app.listen(envs.PORT);
  logger.log(`Application listening on port ${envs.PORT}`);
}
bootstrap();
