import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

let config: ConfigService = new ConfigService();
let secret = config.get('JWT_SECRET');
let prisma: PrismaService = new PrismaService(config);
let jwt: JwtService = new JwtService({
  secret,
  signOptions: {
    expiresIn: '1d',
  },
});

describe('App e2e', () => {
  let app: INestApplication;
  let accessToken: string;

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
    await prisma.user.deleteMany();

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
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('access_token');
        console.log(res.body);
        expect(jwt.verify(res.body.access_token)).toHaveProperty('sub');
      });
  });

  it('POST /auth/signin (invalid email)', () => {
    const wrongEmail = {
      email: 'wrong@email.com',
      password: 'password',
    };

    const wrongPassword = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(wrongEmail)
      .expect(403);
  });

  it('POST /auth/signin (wrong password)', () => {
    const wrongEmail = {
      email: 'wrong@email.com',
      password: 'password',
    };

    const wrongPassword = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(wrongPassword)
      .expect(403);
  });

  it('POST /auth/signin (should login a user)', () => {
    const user = {
      email: 'test@example.com',
      password: 'password',
    };

    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(user)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty('access_token');
        expect(jwt.verify(res.body.access_token)).toHaveProperty('sub');
        accessToken = res.body.access_token;
      });
  });

  it('POST /bookmarks/create (should create a bookmark)', () => {
    const bookmark = {
      title: 'Test Bookmark',
      url: 'https://example.com',
      description: 'This is a test bookmark',
      tags: ['test', 'bookmark'],
    };

    console.log(accessToken);

    return request(app.getHttpServer())
      .post('/bookmarks/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(bookmark)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('data');
      });
  });

  it('POST /bookmarks/create (should create another bookmark)', () => {
    const bookmark = {
      title: 'Test Bookmark Two',
      url: 'https://example.com',
      description: 'This is a test bookmark',
      tags: ['test', 'bookmark', 'two'],
    };

    return request(app.getHttpServer())
      .post('/bookmarks/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(bookmark)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('data');
      });
  });

  afterAll(() => {
    app.close();
  });
});
