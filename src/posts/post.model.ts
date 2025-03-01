import { join, normalize } from '@std/path';
import { db } from '@/config/config.service.ts';
import { schema } from '@/persistence/sqlite.model.ts';
import { Expr } from '@dldc/zendb';

export type Post = {
  /**
   * UUIDv4
   */
  id: string;
  title: string;
  /**
   * Email
   */
  author: string;
  /**
   * Full path to the markdown file, including filename and extension
   */
  path: string;
  draft: boolean;
  /**
   * Stored as milliseconds from epoch
   */
  created_at: number;
  /**
   * Stored as milliseconds from epoch
   */
  modified_at: number;
};

function filenameFromTitle(title: string) {
  return title.toLowerCase().replaceAll(/\b\s+\b/g, '_');
}

// TODO Convert to builder

export class PostEntity {
  #post: Post;
  #content: string;

  private constructor(post: Post, content: string) {
    this.#post = post;
    this.#content = content;
  }

  static new(title: string, author: string, content: string) {
    return new PostEntity(
      {
        id: crypto.randomUUID(),
        title,
        author,
        path: join(
          normalize(Deno.cwd()),
          'content',
          `${filenameFromTitle(title)}.md`,
        ),
        draft: true,
        created_at: Temporal.Now.instant().epochMilliseconds,
        modified_at: Temporal.Now.instant().epochMilliseconds,
      },
      content,
    );
  }

  create() {
    Deno.writeTextFileSync(this.#post.path, this.#content);
    db.exec(
      schema.posts.insert({
        id: this.#post.id,
        title: this.#post.title,
        author: this.#post.author,
        path: this.#post.path,
        draft: this.#post.draft,
        created_at: this.#post.created_at,
        modified_at: this.#post.modified_at,
      }),
    );
  }

  static read(id: string) {
    const postData = db.exec(
      schema.posts
        .query()
        .where((c) => Expr.equal(c.id, Expr.literal(id)))
        .first(),
    );
    const content = Deno.readTextFileSync(postData.path);
    return new PostEntity(postData, content);
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

    return posts.map((post) => new PostEntity(post, ''));
  }

  update() {}

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
