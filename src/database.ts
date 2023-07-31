import { knex as Knex, Knex as KnexInstance } from 'knex';

import { env } from './env';

export const config: KnexInstance.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export const knex = Knex(config);
