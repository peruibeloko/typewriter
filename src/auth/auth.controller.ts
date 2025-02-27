import { LoginRequest, SignupRequest } from '@/auth/auth.middleware.ts';
import * as AuthService from '@/auth/auth.service.ts';
import { Hono } from '@hono';
import { vValidator } from '@hono/valibot-validator';

const auth = new Hono();

auth.post('/login', vValidator('json', LoginRequest), async (c) => {
  const { email, token } = c.req.valid('json');
  const result = await AuthService.login(email, token);
  return c.text(result);
});

auth.post('/signup', vValidator('json', SignupRequest), async (c) => {
  const { displayName, email } = c.req.valid('json');
  const result = await AuthService.signup(displayName, email);
  return c.text(result);
});

export { auth };
