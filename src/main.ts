import { auth } from './auth/auth.controller.ts';
import { post } from './posts/post.controller.ts';

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

export interface Bindings {
  SITE_URL: string;
  DB_PATH: string;
  PORT: number;
  VERBOSE?: boolean;
}

function checkEnv(env: Partial<Bindings>): Bindings {
  const missing = [];

  if (!env.DB_PATH) missing.push('DB_PATH');
  if (!env.SITE_URL) missing.push('SITE_URL');
  if (!env.PORT) missing.push('PORT');

  if (missing.length !== 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return env as Bindings;
}

const app = new Hono<{
  Bindings: Bindings;
}>();
const env = checkEnv(Deno.env.toObject());

app.use(
  cors({
    origin: env.SITE_URL || '*',
    allowMethods: ['POST', 'GET', 'OPTIONS']
  })
);

if (env.VERBOSE) app.use(logger());

app.get('/health', c => c.text('UP'));
app.route('/auth', auth);
app.route('/post', post);

Deno.serve(
  {
    port: 3000,
    hostname: '0.0.0.0',
    onListen: ({ port }) => console.log(`Listening on port ${port}`)
  },
  app.fetch
);
