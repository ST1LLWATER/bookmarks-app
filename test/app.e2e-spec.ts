import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    console.log('BEFOREALL');
    await app.init();
    console.log('BEFOREALL 1');
  });

  afterAll(() => {
    console.log('AFTERALL');
    app.close();
  });

  it.todo('Should Pass');
});
