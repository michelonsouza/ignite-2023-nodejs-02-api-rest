import 'dotenv/config';

import fastify from 'fastify';

import { knex } from './database';

const logger = JSON.parse(process.env.LOGGER);
const port = Number(process.env.PORT);

const app = fastify({
  logger,
});

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*');

  return tables;
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
