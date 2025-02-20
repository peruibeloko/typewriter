import { Post } from '@/posts/post.model.ts';

export function getPaginatedPosts(page: number, size: number) {
  const post = new Post()
}

export function createPost(data: Post) {
  const newPost = new Post();
  newPost
    .save()
    .then(({ _id }) => res.status(201).json(_id))
    .catch(err => res.status(500).send(err.message));
}

export function countPosts() {
  Post.countDocuments()
    .exec()
    .then(count => res.json(count))
    .catch(err => res.status(500).send(err.message));
}

export async function getLatestPostId() {
  if ((await Post.countDocuments().exec()) === 0)
    return res.status(404).send('There are no documents');

  Post.findOne({}, 'id')
    .sort('-createdAt')
    .lean()
    .exec()
    .then(doc => res.send(doc._id))
    .catch(err => res.status(500).send(err.message));
}

export async function getFirstPostId() {
  if ((await Post.countDocuments().exec()) === 0)
    return res.status(404).send('There are no documents');

  Post.findOne({}, 'id')
    .sort('createdAt')
    .lean()
    .exec()
    .then(doc => res.send(doc._id))
    .catch(err => res.status(500).send(err.message));
}

export async function getRandomPostId() {
  if ((await Post.countDocuments().exec()) === 0)
    return res.status(404).send('There are no documents');

  Post.aggregate()
    .sample(1)
    .exec()
    .then(doc => res.send(doc[0]))
    .catch(err => res.status(500).send(err.message));
}

export async function getPostById() {
  const postData = await Post.findById(req.params.id)
    .populate({
      path: 'author',
      select: 'displayName',
      strictPopulate: false,
      transform: doc => doc.displayName
    })
    .lean()
    .exec();

  if (!postData) return res.status(404).send(`Post with id ${req.params.id} doesn't exist`);

  const { prevPostId, nextPostId } = await getNeighbouringPostsByTimestamp(postData.createdAt);

  const { post, ...postMetadata } = postData;
  const result = {
    postData: {
      ...postMetadata,
      content: printMarkdownToHTML(post)
    },
    prevPostId,
    nextPostId
  };

  res.json(result);
}

export async function updatePost() {
  const postAuthor = await Post.findById(req.params.id, 'author')
    .lean()
    .exec()
    .then(val => val?.author);

  if (postAuthor !== req.userInfo.email)
    return res.status(403).send("You're not allowed to edit other users posts");

  Post.updateOne({ id: req.params.id }, req.body)
    .exec()
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err.message));
}

export async function deletePost() {
  const postAuthor = await Post.findById(req.params.id, 'author')
    .populate({
      path: 'author',
      select: 'id',
      strictPopulate: false,
      transform: doc => doc._id
    })
    .exec()
    .then(val => val._id.toString());

  if (postAuthor !== req.userInfo.email)
    return res.status(403).send("You're not allowed to delete other users posts");

  Post.deleteOne({ id: req.params.id })
    .exec()
    .then(() => res.sendStatus(200))
    .catch(err => res.status(500).send(err.message));
}

export async function getNextPostId() {
  const currentPost = await Post.findById(req.params.id, 'createdAt').lean().exec();

  const nextPost = await Post.findOne({ createdAt: { $gt: currentPost.createdAt } }, 'id')
    .sort('-createdAt')
    .exec();

  if (!nextPost) return res.sendStatus(404);
  res.json(nextPost._id);
}

export async function getPreviousPostId() {
  const currentPost = await Post.findById(req.params.id, 'createdAt').lean().exec();

  const prevPost = await Post.findOne({ createdAt: { $lt: currentPost.createdAt } }, 'id')
    .sort('-createdAt')
    .exec();

  if (!prevPost) return res.sendStatus(404);
  res.json(prevPost._id);
}

async function getNeighbouringPostsByTimestamp(timestamp: Date) {
  const [prevPostId, nextPostId] = await Promise.all([
    Post.findOne({ createdAt: { $lt: timestamp } }, 'id')
      .sort('-createdAt')
      .lean()
      .exec(),
    Post.findOne({ createdAt: { $gt: timestamp } }, 'id')
      .sort('createdAt')
      .lean()
      .exec()
  ]).then(promises => promises.map(promise => promise._id));

  return { prevPostId, nextPostId };
}
