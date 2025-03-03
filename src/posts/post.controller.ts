import { checkAuth, checkOwnership } from '@/auth/auth.middleware.ts';
import {
  CreatePostSchema,
  PostBuilder,
  PostEntity,
  UpdatePostSchema
} from '@/posts/post.model.ts';
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
  const posts = PostEntity.list(page, size);
  return c.json(posts);
});

post.post('/', checkAuth, vValidator('json', CreatePostSchema), (c) => {
  const { title, author, content } = c.req.valid('json');
  PostBuilder.NewPost(title, author, content).create();
  c.status(201);
  return c.text('');
});

post.get('/:id', (c) => {
  const postId = c.req.param('id');
  const postData = PostEntity.read(postId);
  return c.json(postData);
});

post.patch(
  '/:id',
  checkAuth,
  checkOwnership,
  vValidator('json', UpdatePostSchema),
  (c) => {
    const postId = c.req.param('id');
    const { content, title, draft } = c.req.valid('json');

    const builder = new PostBuilder();
    if (title) builder.title(title);
    if (draft) builder.draft(draft);
    if (content) builder.content(content);

    PostEntity.update(postId, builder);
    c.status(204);
    return c.text('');
  },
);

post.delete('/:id', checkAuth, checkOwnership, (c) => {
  const postId = c.req.param('id');
  PostEntity.delete(postId);
  c.status(204);
  return c.text('');
});

export { post };
