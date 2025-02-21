import { EntryAllowlist } from '@/auth/auth.types.ts';

import { DB } from 'sqlite';

export class Allowlist {
  #db: DB;

  constructor(db: DB) {
    this.#db = db;
  }

  isActive(email: string) {
    const [{ isActive }] = this.#db.queryEntries<
      Pick<EntryAllowlist, 'isActive'>
    >(
      'SELECT isActive FROM allowlist WHERE email = :email',
      {
        email,
      },
    );
    this.#db.close();

    return isActive;
  }

  register(email: string) {
    this.#db.query('INSERT INTO allowlist (email) VALUES (:email)', {
      email,
    });
  }
}
