const id = (email: string): Deno.KvKey => ['allowlist', email];

export class Allowlist {
  static async get(email: string) {
    const kv = await Deno.openKv();
    const result = await kv.get<boolean>(id(email));
    kv.close();
    return result.value;
  }

  static async register(email: string) {
    const kv = await Deno.openKv();
    kv.set(id(email), true);
    kv.close();
  }
}
