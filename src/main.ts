import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

Object.defineProperty(BigInt.prototype, 'toJSON', {
  get() {
    return function (this: bigint) {
      return this.toString();
    };
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiConfig = new DocumentBuilder()
    .setTitle('123Ferry API')
    .setDescription('Destinada a venda de passagens de ferryboat')
    .setVersion('1.0')
    .addTag('123ferry')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, apiConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
