import { execSync } from 'node:child_process';
import {
  expect,
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest';
import supertest from 'supertest';
import { fakerPT_BR as faker } from '@faker-js/faker';

import { app } from '../src/app';

describe('APP.transactions routes', async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:latest');
  });

  afterEach(() => {
    execSync('npm run knex migrate:rollback --all');
  });

  it('should be able to create a new transaction', async () => {
    const data = {
      title: faker.word.words(4),
      amount: faker.number.int({ min: 1000, max: 1000 }),
      type: 'credit',
    };

    const response = await supertest(app.server)
      .post('/transactions')
      .send(data);

    expect(response.statusCode).toEqual(201);
  });

  it('shound be able to list all transactions', async () => {
    const data = {
      title: faker.word.words(4),
      amount: faker.number.int({ min: 1000, max: 1000 }),
      type: 'credit',
    };

    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send(data);

    const cookies = createTransactionResponse.get('Set-Cookie');

    const response = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    expect(response.statusCode).toEqual(200);
    expect(response?.body?.transactions).toEqual([
      expect.objectContaining({
        title: data.title,
        amount: data.amount,
      }),
    ]);
  });

  it('shound be able to get especific transactions', async () => {
    const data = {
      title: faker.word.words(4),
      amount: faker.number.int({ min: 1000, max: 1000 }),
      type: 'credit',
    };

    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send(data);

    const cookies = createTransactionResponse.get('Set-Cookie');

    const response = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    const transactionId = response.body?.transactions?.[0].id;

    const getTransactionResponse = await supertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies);

    expect(getTransactionResponse.statusCode).toEqual(200);
    expect(getTransactionResponse?.body?.transaction).toEqual(
      expect.objectContaining({
        title: data.title,
        amount: data.amount,
      }),
    );
  });

  it('shound be able to get the summary', async () => {
    const firstdata = {
      title: faker.word.words(4),
      amount: faker.number.int({ min: 1000, max: 10000 }),
      type: 'credit',
    };

    const secondData = {
      title: faker.word.words(4),
      amount: faker.number.int({ min: firstdata.amount, max: 10000 }),
      type: 'debit',
    };

    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send(firstdata);

    const cookies = createTransactionResponse.get('Set-Cookie');

    await supertest(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send(secondData);

    const response = await supertest(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies);

    expect(response.statusCode).toEqual(200);
    expect(response?.body?.summary).toEqual({
      amount: firstdata.amount - secondData.amount,
    });
  });

  it('shound not be able to list all transactions without session_id', async () => {
    const response = await supertest(app.server).get('/transactions');

    expect(response.statusCode).toEqual(401);
  });
});
