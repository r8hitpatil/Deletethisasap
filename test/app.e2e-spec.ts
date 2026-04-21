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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist : true,
    }))

    app.use(cookieParser());

    await app.init();

    const httpServer = app.getHttpServer();
    // const port = 3000;
    // pactum.request.setBaseUrl(`http://localhost:${port}`);
    
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

  describe(('Auth'),() => {
    const dto:RegisterDto = {
      fname: "Rohit",
      lname: "Patil",
      email:'rohit@gmail.com',
      password:'Rohit@123'
    };
    describe('Signup',() => {
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
      it('should signup',() => {
        return pactum
        .spec()
        .post('/auth/register')
        .withBody(dto)
        .expectStatus(201)
        .stores('accessToken','res.headers.set-cookie[1]')
        .stores('refreshToken','res.headers.set-cookie[0]')
      })
    })
  })
  describe('Create Course',() => {
    const dto : CreateCourseDto = {
      "name":"Dhurv Kathee",
      "description":"Gand maro course",
      "price":5
    };
    describe('Create',() => {
      it('should throw if name empty', () => {
        return pactum
          .spec()
          .post('/courses/create')
          .withBody({
            name: dto.name,
          })
          .expectStatus(400);
      });
      it('should throw if description empty', () => {
        return pactum
          .spec()
          .post('/courses/create')
          .withBody({
            description: dto.description,
          })
          .expectStatus(400);
      });
      it('should throw if price empty', () => {
        return pactum
          .spec()
          .post('/courses/create')
          .withBody({
            price: dto.price,
          })
          .expectStatus(400);
      });
      it('should create course', () => {
        return pactum
          .spec()
          .post('/courses/create')
          .withBody(dto)
          .withCookies({
            'access_token': '$S{accessToken}',
            'refresh_token': '$S{refreshToken}'
          })
          .expectStatus(201);
      });
      it('debug tokens', () => {
        console.log(pactum.stash.getDataStore());
      });
    })
  })
});
