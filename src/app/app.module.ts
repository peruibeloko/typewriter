import { routes } from '@/app/app.controller.ts';
import { Config, Typewriter } from '@/app/app.types.ts';

import { Hono } from '@hono';
import { cors } from '@hono/cors';
import { showRoutes } from '@hono/dev';
import { logger } from '@hono/logger';

export function typewriter(config: Config) {
  const app = new Hono<Typewriter>();

  app.use(cors({ origin: '*' }));

  if (config.env.VERBOSE) {
    app.use(logger());
    showRoutes(routes, {
      colorize: true,
      verbose: true,
    });
  }

  app.use(async (c, next) => {
    c.set('env', config.env);
    await next();
  });

  app.route('/', routes);

  return app.fetch;
}
