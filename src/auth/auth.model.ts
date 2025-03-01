import { db } from '@/config/config.service.ts';
import { schema } from '@/persistence/sqlite.model.ts';
import { Expr } from '@dldc/zendb';

export class Auth {
  static isActive(email: string): boolean {
    const { isActive } = db.exec(
      schema.auth
        .query()
        .select((c) => ({ isActive: c.isActive }))
        .where((c) => Expr.equal(c.email, Expr.external(email)))
        .first(),
    );
    return isActive;
  }

  static activate(email: string) {
    db.exec(
      schema.auth.update({ isActive: true }, (c) =>
        Expr.equal(c.email, Expr.literal(email)),
      ),
    );
  }

  static register(email: string) {
    db.exec(schema.auth.insert({ email }));
  }
}
