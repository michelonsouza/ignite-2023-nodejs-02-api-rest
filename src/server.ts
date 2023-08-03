import { app } from './app';
import { env } from './env';

const port = Number(env.PORT);

app
  .listen({
    port,
    host: '0.0.0.0',
  })
  .then(() => {
    console.info(`Server is running on http://0.0.0.0:${port} 🚀`);
  })
  .catch(error => {
    app.log.error(error);
    process.exit(1);
  });
