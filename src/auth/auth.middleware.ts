import { createMiddleware } from '@hono/factory';
import { jwt } from '@hono/jwt';
import * as v from 'valibot';

export const LoginRequest = v.object({
  email: v.pipe(v.string(), v.email()),
  token: v.pipe(v.string(), v.regex(/^\d{6}$/)),
});

export const SignupRequest = v.object({
  displayName: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(v.string(), v.email()),
});

export const checkAuth = createMiddleware((c, next) =>
  jwt({ secret: c.get('env').JWT_SECRET })(c, next),
);
