import { routes } from '@/app/app.controller.ts';
import { Typewriter } from '@/app/app.types.ts';
import { db, env } from '@/app/app.config.ts';

import { Hono } from '@hono';
import { cors } from '@hono/cors';
import { logger } from '@hono/logger';

export function typewriter() {
  return {
    server: setupHono(),
    shutdown: setupShutdown(),
  };
}

function setupHono() {
  const app = new Hono<Typewriter>();

  app.use(cors({ origin: '*' }));

  if (env.VERBOSE) {
    app.use(logger());
  }

  app.route('/', routes);

  return app.fetch;
}

function setupShutdown() {
  const shutdown = new AbortController();

  const routine = () => {
    console.log('Received SIGTERM, aborting current requests');
    shutdown.abort();
    console.log('Done ✅');
    console.log('Closing DB connection');
    db.close();
    console.log('Done ✅');
  };

  return {
    signal: shutdown.signal,
    function: routine,
  };
}
