import { PostEntity } from '@/posts/post.model.ts';
import { createMiddleware } from '@hono/factory';
import { HTTPException } from '@hono/http-exception';
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

export const checkOwnership = createMiddleware(async (c, next) => {
  const id = c.req.param('id');
  const user = c.get('jwtPayload')['aud'];
  const { author } = PostEntity.readMetadata(id as string).info;
  if (!(author === user)) {
    throw new HTTPException(403, { message: "You don't own this post" });
  }
  await next();
});
