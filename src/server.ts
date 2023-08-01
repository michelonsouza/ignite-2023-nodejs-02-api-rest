import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { env } from './env';
import { transactionsRoutes } from './routes';

const logger = !!JSON.parse(env.LOGGER);
const port = Number(env.PORT);

const app = fastify({
  logger,
});

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: 'transactions',
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
