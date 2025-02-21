import { join } from '@std/path';

export class Filesystem {
  #path: string[];

  constructor(base: string[]) {
    this.#path = [...base, 'data', 'files'];
  }

  readFile(filename: string) {
    return Deno.readTextFile(join(...this.#path, filename));
  }

  writeFile(filename: string, data: string) {
    return Deno.writeTextFile(join(...this.#path, filename), data);
  }

  public get path(): string {
    return join(...this.#path);
  }
}
