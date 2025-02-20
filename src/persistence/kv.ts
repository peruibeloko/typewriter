import { join } from 'std/path';

export class Kv {
  #path: string[];

  public get path(): string[] {
    return this.#path;
  }

  constructor(base: string[]) {
    this.#path = [...base, 'data'];
  }

  open() {
    return Deno.openKv(join(...this.#path));
  }

  async listAll<T>(selector: Deno.KvListSelector) {
    const kv = await this.open();
    return kv.list<T>(selector);
  }
}
