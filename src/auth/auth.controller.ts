import * as AuthService from '@/auth/auth.service.ts';
import { RequestLogin, RequestSignup } from '@/auth/auth.types.ts';

import { Hono } from '@hono';
import { HTTPException } from '@hono/http-exception';

const auth = new Hono();

auth.post('/login', async (c) => {
  const body = await c.req.json<RequestLogin>();
  const result = await AuthService.login(body.email, body.token);

  if (result instanceof HTTPException) throw result;
  else return c.text(result);
});

auth.post('/signup', async (c) => {
  const body = await c.req.json<RequestSignup>();
  const result = await AuthService.signup(body.displayName, body.email);

  if (result instanceof HTTPException) throw result;
  else return c.text(result);
});

export { auth };
