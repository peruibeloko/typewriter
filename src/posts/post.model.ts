import { db } from '@/config/config.service.ts';
import { schema } from '@/persistence/sqlite.model.ts';
import { Expr } from '@dldc/zendb';
import { join, normalize } from '@std/path';
import * as v from 'valibot';

function filenameFromTitle(title: string) {
  return title.toLowerCase().replaceAll(/\b\s+\b/g, '_');
}

export const PostSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  title: v.pipe(v.string()),
  author: v.pipe(v.string()),
  path: v.pipe(v.string()),
  draft: v.pipe(v.boolean()),
  created_at: v.pipe(v.number(), v.integer()),
  modified_at: v.pipe(v.number(), v.integer()),
  content: v.pipe(v.string()),
});

export const UpdatePostSchema = v.partial(
  v.pick(PostSchema, ['draft', 'title', 'content']),
);
export const CreatePostSchema = v.pick(PostSchema, [
  'title',
  'author',
  'content',
]);

export type Post = v.InferInput<typeof PostSchema>;

export class PostBuilder {
  #id: null | string = null;
  #title: null | string = null;
  #author: null | string = null;
  #path: null | string = null;
  #draft: null | boolean = null;
  #created_at: null | number = null;
  #modified_at: null | number = null;
  #content: null | string = null;

  id(v: string) {
    this.#id = v;
    return this;
  }

  title(v: string) {
    this.#title = v;
    return this;
  }

  author(v: string) {
    this.#author = v;
    return this;
  }

  path(v: string) {
    this.#path = v;
    return this;
  }

  content(v: string) {
    this.#content = v;
    return this;
  }

  draft(v: boolean) {
    this.#draft = v;
    return this;
  }

  created_at(v: number) {
    this.#created_at = v;
    return this;
  }

  modified_at(v: number) {
    this.#modified_at = v;
    return this;
  }

  build() {
    return new PostEntity(this);
  }

  *[Symbol.iterator]() {
    if (this.#id !== null) yield ['id', this.#id];
    if (this.#title !== null) yield ['title', this.#title];
    if (this.#author !== null) yield ['author', this.#author];
    if (this.#path !== null) yield ['path', this.#path];
    if (this.#draft !== null) yield ['draft', this.#draft];
    if (this.#created_at !== null) yield ['created_at', this.#created_at];
    if (this.#modified_at !== null) yield ['modified_at', this.#modified_at];
    if (this.#content !== null) yield ['content', this.#content];
  }

  fromPost(postData: Post) {
    this.#id = postData.id;
    this.#title = postData.title;
    this.#author = postData.author;
    this.#path = postData.path;
    this.#draft = postData.draft;
    this.#created_at = postData.created_at;
    this.#modified_at = postData.modified_at;
    this.#content = postData.content;
    return this;
  }

  toPost(): Post {
    return {
      id: this.#id ?? '',
      title: this.#title ?? '',
      author: this.#author ?? '',
      path: this.#path ?? '',
      draft: this.#draft ?? true,
      created_at: this.#created_at ?? 0,
      modified_at: this.#modified_at ?? 0,
      content: this.#content ?? '',
    };
  }

  toObject(): Partial<Post> {
    return Object.fromEntries(this);
  }

  static NewPost(title: string, author: string, content: string) {
    return new PostBuilder()
      .id(crypto.randomUUID())
      .title(title)
      .author(author)
      .path(
        join(
          normalize(Deno.cwd()),
          'content',
          `${filenameFromTitle(title)}.md`,
        ),
      )
      .draft(true)
      .created_at(Temporal.Now.instant().epochMilliseconds)
      .modified_at(Temporal.Now.instant().epochMilliseconds)
      .content(content)
      .build();
  }
}

export class PostEntity {
  #post: Post;

  constructor(builder: PostBuilder) {
    this.#post = builder.toPost();
  }

  #toPost(): Post {
    return {
      id: this.#post.id,
      title: this.#post.title,
      author: this.#post.author,
      path: this.#post.path,
      draft: this.#post.draft,
      created_at: this.#post.created_at,
      modified_at: this.#post.modified_at,
      content: this.#post.content,
    };
  }

  get info() {
    return {
      id: this.#post.id,
      title: this.#post.title,
      author: this.#post.author,
      draft: this.#post.draft,
      created_at: this.#post.created_at,
      modified_at: this.#post.modified_at,
    };
  }

  static getPathById(id: string) {
    const { path } = db.exec(
      schema.posts
        .query()
        .select((c) => ({ path: c.path }))
        .where((c) => Expr.equal(c.id, Expr.literal(id)))
        .first(),
    );

    return path;
  }

  create() {
    Deno.writeTextFileSync(this.#post.path, this.#post.content);
    db.exec(schema.posts.insert(this.#toPost()));
  }

  static read(id: string) {
    const metadata = this.readMetadata(id);
    metadata.#post.content = Deno.readTextFileSync(metadata.#post.path);
    return metadata;
  }

  static readMetadata(id: string) {
    const postData = db.exec(
      schema.posts
        .query()
        .where((c) => Expr.equal(c.id, Expr.literal(id)))
        .first(),
    );
    return new PostBuilder().fromPost({ ...postData, content: '' }).build();
  }

  static list(page: number, size: number) {
    const posts = db.exec(
      schema.posts
        .query()
        .andSortDesc((c) => c.created_at)
        .offset(() => Expr.literal(page * size))
        .limit(() => Expr.literal(size))
        .all(),
    );

    return posts.map((postData) =>
      new PostBuilder().fromPost({ ...postData, content: '' }).build(),
    );
  }

  static update(id: string, builder: PostBuilder) {
    const data = Object.fromEntries(builder) as Partial<Post>;
    db.exec(schema.posts.updateEqual(data, { id }));

    if (!data.content) return;
    Deno.writeTextFileSync(this.getPathById(id), data.content);
  }

  static delete(id: string) {
    const { path } = db.exec(
      schema.posts
        .query()
        .select((c) => ({ path: c.path }))
        .where((c) => Expr.equal(c.id, Expr.literal(id)))
        .first(),
    );
    db.exec(schema.posts.delete((c) => Expr.equal(c.id, Expr.literal(id))));
    Deno.removeSync(path);
  }
}
