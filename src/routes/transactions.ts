import { randomUUID } from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '@/database';
import { checkSessionIdExists } from '@/middlewares';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async request => {
      const { sessionId: session_id } = request.cookies;

      const transactions = await knex('transactions').where({ session_id });

      return { transactions };
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async ({ params, cookies }) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(params);
      const { sessionId: session_id } = cookies || {};

      const transaction = await knex('transactions')
        .where({ id, session_id })
        .first();

      return { transaction };
    },
  );

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async ({ cookies }) => {
      const { sessionId: session_id } = cookies || {};

      const summary = await knex('transactions')
        .where({ session_id })
        .sum('amount', { as: 'amount' })
        .first();

      return { summary };
    },
  );

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const { amount, title, type } = createTransactionBodySchema.parse(
      request.body,
    );

    let sessionId = request.cookies?.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      session_id: sessionId,
      amount: type === 'credit' ? amount : amount * -1,
    });

    return reply.status(201).send();
  });
}
