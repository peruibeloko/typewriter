import * as post from '@/posts/post.service.ts';
import { Hono } from 'hono';
import { checkAuth } from "@/middleware.ts";


const post = new Hono();

post.get('/', c => {
  const page = Number(c.req.query('page'));
  const size = Number(c.req.query('size'));
  const hasValidBounds = ![isNaN(page), isNaN(size)].includes(true);

  if (!hasValidBounds) {
    c.status(400);
    c.text('Invalid bounds');
  }

  return c.json(post.getPaginatedPosts(page, size));
});
post.post('/', checkAuth, c => post.createPost);

post.get('/count', post.countPosts);
post.get('/latest', post.getLatestPostId);
post.get('/first', post.getFirstPostId);
post.get('/random', post.getRandomPostId);

post
  .get('/:id', post.getPostById)
  .patch('/:id', checkAuth, post.updatePost)
  .delete('/:id', checkAuth, post.deletePost);

post.get('/:id/next', post.getNextPostId);
post.get('/:id/prev', post.getPreviousPostId);

export { post };
