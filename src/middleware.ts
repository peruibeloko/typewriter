import { jwt } from 'hono/jwt';

export const checkAuth = jwt({ secret: Deno.env.get('JWT_SECRET') as string });
