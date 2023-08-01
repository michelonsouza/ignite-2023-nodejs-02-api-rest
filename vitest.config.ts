/* eslint-disable import/no-extraneous-dependencies */
import { URL } from 'node:url';
import { defineConfig } from 'vitest/config';

const srcPath = new URL('./src', import.meta.url);

export default defineConfig({
  resolve: {
    alias: {
      '@': srcPath.pathname,
    },
  },
});
