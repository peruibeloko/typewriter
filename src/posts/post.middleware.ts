import { Typewriter } from "@/app/app.types.ts";
import { createMiddleware } from 'hono/factory';

export const parsePagination = createMiddleware<Typewriter>(async (c, next) => {
  const page = Number(c.req.query('page'));
  const size = Number(c.req.query('size'));
  const hasValidBounds = ![isNaN(page), isNaN(size)].includes(true);

  if (!hasValidBounds) {
    c.status(400);
    c.text('Invalid bounds');
  }

  c.set('page', page);
  c.set('size', size);

  await next();
});
