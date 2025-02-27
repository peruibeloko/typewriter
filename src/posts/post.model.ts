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
        title,
        author,
        id: crypto.randomUUID(),
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

  create() {}

  read() {}

  list() {}

  update() {}

  delete() {}
}
