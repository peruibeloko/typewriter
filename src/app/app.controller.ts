import { Typewriter } from '@/app/app.types.ts';
import { auth } from '@/auth/auth.controller.ts';
import { post } from '@/posts/post.controller.ts';

import { Hono } from '@hono';

const routes = new Hono<Typewriter>();

routes.get('/health', (c) => c.text('UP'));
routes.get('/info', (c) => {
  const info = {
    cwd: Deno.cwd(),
    dir: [
      ...Deno.readDirSync(Deno.cwd()).map((dir) =>
        `${dir.name}${dir.isDirectory ? '/' : ''}`
      ),
    ],
  };

  return c.json(info);
});
routes.route('/auth', auth);
routes.route('/post', post);

export { routes };
