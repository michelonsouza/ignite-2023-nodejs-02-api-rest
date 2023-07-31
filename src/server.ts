import { randomUUID } from 'node:crypto';
import fastify from 'fastify';

import { knex } from './database';
import { env } from './env';

const logger = !!JSON.parse(env.LOGGER);
const port = Number(env.PORT);

const app = fastify({
  logger,
});

app.get('/hello', async () => {
  const transacions = await knex('transactions').select('*');

  return transacions;
});

app
  .listen({
    port,
  })
  .then(() => {
    console.info(`Server is running on http://localhost:${port} 🚀`);
  })
  .catch(error => {
    app.log.error(error);
    process.exit(1);
  });
