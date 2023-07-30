import fastify from 'fastify';

import { testLog } from '@/folder';

const app = fastify({
  logger: true,
});

app.get('/hello', async (_request, _response) => 'Hello World');

const port = 3333;
app
  .listen({
    port,
  })
  .then(() => {
    testLog();
    console.info(`Server is running on http://localhost:${port} 🚀`);
  })
  .catch(error => {
    app.log.error(error);
    process.exit(1);
  });
