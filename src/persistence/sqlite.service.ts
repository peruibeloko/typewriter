import { join } from '@std/path';

import { parseString } from "@/config/config.utils.ts";
import { SQLite } from '@/persistence/sqlite.model.ts';

// TODO add these back

function dbFileMissing(path: string) {
  console.log('Provided DB path does not point to a file');
  const shouldCreate = confirm('Would you like to create a database file now?');

  if (!shouldCreate) return new Error('Database file missing');

  const newPath = join(path, 'typewriter.db');
  const db = SQLite.instance(newPath);
  db.sqlDb.close();

  console.log(`Database was created in ${newPath}`);
  console.log(
    'Update your configuration to use this value and run typewriter again',
  );
  Deno.exit(1);
}

export function validateDbPath(name: string, path?: string) {
  const parseResult = parseString(name, path);

  if (parseResult instanceof Error) return parseResult;

  try {
    Deno.readFileSync(parseResult);
  } catch {
    return dbFileMissing(parseResult);
  }

  return parseResult;
}
