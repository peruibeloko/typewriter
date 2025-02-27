import { Database as Driver } from '@db/sqlite';
import { DbDatabase as Adapter, TDbDatabase } from '@dldc/zendb-db-sqlite';
import { Column, Table, Database } from '@dldc/zendb';

export const schema = Table.declareMany({
  auth: {
    email: Column.text().primary(),
    isActive: Column.boolean().defaultValue(() => false),
  },
  users: {
    email: Column.text().primary(),
    displayName: Column.text(),
    totpSecret: Column.text(),
  },
  posts: {
    id: Column.text().primary(),
    title: Column.text(),
    author: Column.text(),
    path: Column.text().unique(),
    draft: Column.boolean().defaultValue(() => true),
    created_at: Column.number(),
    modified_at: Column.number(),
  },
});

export class SQLite {
  static #instance: SQLite;
  #db: TDbDatabase;

  private constructor(path: string) {
    this.#db = Adapter(new Driver(path));

    if (this.#db.exec(Database.tables()).length === 0) {
      this.#db.execMany(
        Database.schema(schema, { ifNotExists: true, strict: true }),
      );
    }
  }

  public static instance(path: string): TDbDatabase {
    if (!SQLite.#instance) {
      SQLite.#instance = new SQLite(path);
    }

    return SQLite.#instance.#db;
  }
}
