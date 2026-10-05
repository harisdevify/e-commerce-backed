import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should return user Id and their post and post comments and likes (GET)', () => {
    return request(app.getHttpServer())
      .get('/users/100/posts/55?status=published&likes=20&comments=5')
      .expect(200)
      .expect(
        'User ID: 100, Post ID: 55, Like: 20, Comments: 5, Status: published',
      );
  });

  it('should return single prodcut (GET)', () => {
    return request(app.getHttpServer())
      .get('/products/123?reviews=100')
      .expect(200)
      .expect('Product: 123, Reviews: 100');
  });

  it('shoud create a user (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Haris',
        email: 'haris@gmail.com',
        age: 25,
      })
      .expect(201)
      .expect('Name: Haris, Email: haris@gmail.com, Age: 25');
  });

  afterEach(async () => {
    await app.close();
  });
});
