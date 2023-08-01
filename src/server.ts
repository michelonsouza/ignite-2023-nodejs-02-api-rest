import { app } from './app';
import { env } from './env';

const port = Number(env.PORT);

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
