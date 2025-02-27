import { checkAuth } from '@/auth/auth.middleware.ts';
import * as Post from '@/posts/post.service.ts';
import { Hono } from '@hono';
import { vValidator } from '@hono/valibot-validator';
import * as v from 'valibot';

const PaginationSchema = v.object({
  page: v.pipe(v.number(), v.integer(), v.minValue(0)),
  size: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

const post = new Hono();

post.get('/', vValidator('query', PaginationSchema), (c) => {
  const { page, size } = c.req.valid('query');
  const posts = Post.paginatedList(page, size);
  return c.json(posts);
});

post.post('/', checkAuth, async (c) => {
  const { title, author, content } = await c.req.json();
  Post.create(title, author, content);
  c.status(201);
  c.text('');
});

post.get('/:id', (c) => {
  const postId = c.req.param('id');
  const postData = Post.getById(postId);
  return c.json(postData);
});

post.patch('/:id', checkAuth, async (c) => {
  const postId = c.req.param('id');
  const { postData, content } = await c.req.json();
  Post.updateById(postId, postData, content);
  c.status(204);
  return c.text('');
});

post.delete('/:id', checkAuth, (c) => {
  const postId = c.req.param('id');
  Post.deleteById(postId);
  c.status(204);
  return c.text('');
});

export { post };
