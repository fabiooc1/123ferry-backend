import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

Object.defineProperty(BigInt.prototype, 'toJSON', {
  get() {
    return function (this: bigint) {
      return this.toString();
    };
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
