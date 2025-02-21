import { User } from '@/user/user.model.ts';

interface KvPost {
  title: string;
  filePath: string[];
  metadata: {
    author: Deno.KvKey;
    createdAt: Temporal.PlainDateTime;
    lastUpdated: Temporal.PlainDateTime;
  };
}

export class Post {
  #postId: string;
  #id: Deno.KvKey;
  #title: string;
  #content: string;
  #draft: boolean;
  #author: User;

  constructor(basePath: string[], title: string, author: User, content: string = '') {
    this.#postId = crypto.randomUUID();
    this.#id = ['posts', this.#postId];
    this.#title = title;
    this.#content = content;
    this.#draft = true;
    this.#author = author;
  }

  async persist() {
    const kv = await this.kv.open();
    await kv.set(this.#id, {
      title: this.#title,
      filePath: [...this.filesystem.path, `${this.#postId}.md`],
      metadata: {
        author: this.#author.id,
        createdAt: Temporal.Now.plainDateTimeISO(),
        lastUpdated: Temporal.Now.plainDateTimeISO()
      }
    });
    return this.filesystem.writeFile(`${this.#postId}.md`, this.#content);
  }

  contents() {
    return this.filesystem.readFile(`${this.#postId}.md`);
  }

  static get(id: Deno.KvKey) {}
  static remove(id: Deno.KvKey) {}

  public get title(): string {
    return this.#title;
  }

  public get draft(): boolean {
    return this.#draft;
  }
}
