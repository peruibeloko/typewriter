import { Typewriter } from '@/app/app.types.ts';
import { parsePagination } from '@/posts/post.middleware.ts';
import * as PostService from '@/posts/post.service.ts';
import { Hono } from 'hono';
import { checkAuth } from '@/auth/auth.middleware.ts';

const post = new Hono<Typewriter>();

post
  .basePath('/')
  .get(parsePagination, c => c.json(PostService.getPaginatedPosts(c.get('page'), c.get('size'))))
  .post(checkAuth, c => c.json(PostService.createPost));

post
  .basePath('/:id')
  .get(PostService.getPostById)
  .patch(checkAuth, PostService.updatePost)
  .delete(checkAuth, PostService.deletePost);

export { post };
