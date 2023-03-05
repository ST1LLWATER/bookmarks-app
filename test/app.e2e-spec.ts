import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
  });

  it('POST /auth/signup (should create a new user)', () => {
    const user = {
      email: 'test@example.com',
      password: 'password',
    };

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });

  afterAll(() => {
    app.close();
  });
});
