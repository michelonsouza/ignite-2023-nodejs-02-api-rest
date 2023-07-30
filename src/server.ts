import 'dotenv/config';

import fastify from 'fastify';

import { knex } from './database';

const app = fastify({
  logger: JSON.parse(process.env.LOGGER),
});

app.get('/hello', async () => {
  const tables = await knex('sqlite_schema').select('*');

  return tables;
});

app
  .listen({
    port: Number(process.env.PORT),
  })
  .then(() => {
    console.info(
      `Server is running on http://localhost:${process.env.PORT} 🚀`,
    );
  })
  .catch(error => {
    app.log.error(error);
    process.exit(1);
  });
