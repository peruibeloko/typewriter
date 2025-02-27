import { Database as Driver } from '@db/sqlite';
import { DbDatabase as Adapter } from '@dldc/zendb-db-sqlite';
import { Column, Table, Database, Expr } from '@dldc/zendb';

const schema = Table.declareMany({
  test: {
    name: Column.text().primary(),
    age: Column.integer(),
  },
});

const db = Adapter(
  new Driver(':memory:', {
    memory: true,
  }),
);

db.execMany(Database.schema(schema, { ifNotExists: true, strict: true }));
db.exec(
  schema.test.insertMany([
    { name: 'a', age: 10 },
    { name: 'b', age: 11 },
    { name: 'c', age: 12 },
  ]),
);
const result = db.exec(
  schema.test
    .query()
    .select((c) => ({ nome: c.name }))
    .where((c) => Expr.equal(c.age, Expr.literal(11)))
    .all(),
);

console.log(result);
