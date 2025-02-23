import { DB } from 'sqlite';

export class SQLite {
  static #instance: SQLite;
  #db: DB;

  private constructor(path?: string) {
    this.#db = new DB(path);
  }

  public static instance(path?: string): DB {
    if (!SQLite.#instance) {
      SQLite.#instance = new SQLite(path);
    }

    return SQLite.#instance.#db;
  }
}
