interface KvUser {
  displayName: string;
  totpSecret: string;
}

interface UserI extends KvUser {
  email: string;
}

const id = (email: string) => ['users', email];

export class User {
  #id: Deno.KvKey;
  #displayName: string;
  #totpSecret: string;
  #email: string;

  public get displayName(): string {
    return this.#displayName;
  }

  public get secret(): string {
    return this.#totpSecret;
  }

  public get email(): string {
    return this.#email;
  }

  public get id(): Deno.KvKey {
    return this.#id;
  }

  constructor({ displayName, email, totpSecret }: UserI) {
    this.#id = id(email);
    this.#displayName = displayName;
    this.#email = email;
    this.#totpSecret = totpSecret;
  }

  static async get(email: string) {
    const kv = await Deno.openKv();
    const { value: user } = await kv.get<KvUser>(id(email));
    kv.close();
    return user && new User({ ...user, email });
  }

  async save() {
    const kv = await Deno.openKv();
    await kv.set(this.#id, {
      displayName: this.#displayName,
      totpSecret: this.#totpSecret,
    });
    kv.close();
  }
}
