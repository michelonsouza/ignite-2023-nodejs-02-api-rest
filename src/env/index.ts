import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL environment variable is required',
  }),
  PORT: z.string().default('3333'),
  LOGGER: z.enum(['true', 'false']).default('false'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'], {
      required_error: 'NODE_ENV environment variable is required',
    })
    .default('production'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error({
    message: '⚠️ Invalid environment variables',
    error: _env.error.format(),
  });

  throw _env.error.format();
}

export const env = _env.data;
