import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

const capabibara = async () => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(3000);
}

capabibara();
