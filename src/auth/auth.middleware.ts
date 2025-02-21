import { Typewriter } from '@/app/app.types.ts';
import { createMiddleware } from 'hono/factory';
import { jwt } from 'hono/jwt';

export const checkAuth = createMiddleware<Typewriter>((c, next) =>
  jwt({ secret: c.get('env').JWT_SECRET })(c, next)
);
