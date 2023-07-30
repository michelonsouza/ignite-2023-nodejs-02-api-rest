import { knex as Knex, Knex as KnexInstance } from 'knex';

export const config: KnexInstance.Config = {
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
};

export const knex = Knex(config);
