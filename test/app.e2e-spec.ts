import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto';
import * as pactum from 'pactum';
import { CreateCourseDto } from 'src/course/dto/create-course.dto';
import cookieParser from 'cookie-parser';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authCookies: string; // To store the cookies

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );

    app.use(cookieParser());

    await app.init();

    await app.listen(0);
    const url = await app.getUrl();
    pactum.request.setBaseUrl(url);

    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Auth', () => {
    const dto: RegisterDto = {
      fname: 'Rohit',
      lname: 'Patil',
      email: 'rohit@gmail.com',
      password: 'Rohit@123',
      role: 'ADMIN',
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/register').expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201)
          .expect((ctx) => {
            // Capture and format cookies
            const cookies = ctx.res.headers['set-cookie'];
            authCookies = cookies!.map(cookie => cookie.split(';')[0]).join('; '); // stores the cookies in authCookies
          });
      });
    });
  });

  describe('Create Course', () => {
    const dto: CreateCourseDto = {
      name: 'Dhruv Rathee Course',
      description: 'Advanced Programming',
      price: 5,
    };

    describe('Create', () => {
      it('should throw if name empty', () => {
        return pactum
          .spec()
          .post('/courses/create')
          .withHeaders({
            Cookie: authCookies,
          })
          .withBody({
            description: dto.description,
            price: dto.price,
          })
          .expectStatus(400);
      });

      it('should throw if description empty', () => {
        return pactum
          .spec()
          .post('/courses/create')
          .withHeaders({
            Cookie: authCookies,
          })
          .withBody({
            name: dto.name,
            price: dto.price,
          })
          .expectStatus(400);
      });

      it('should throw if price empty', () => {
        return pactum
          .spec()
          .post('/courses/create')
          .withHeaders({
            Cookie: authCookies,
          })
          .withBody({
            name: dto.name,
            description: dto.description,
          })
          .expectStatus(400);
      });

      it('should create course', () => {
        return pactum
          .spec()
          .post('/courses/create')
          .withHeaders({
            Cookie: authCookies,
          })
          .withBody(dto)
          .expectStatus(201);
      });
    });
  });
});