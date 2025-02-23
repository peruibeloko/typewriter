import { join, normalize } from '@std/path';
import { DB } from 'sqlite';

function dbFileMissing(path: string) {
  console.log('DB_PATH does not point to a file');
  const shouldCreate = confirm(
    'Would you like to create the database file now?',
  );

  if (!shouldCreate) return new Error('Database file missing');

  const newPath = join(path, 'typewriter.db');
  const db = new DB(newPath);

  const script = Deno.readTextFileSync(
    normalize(join('src', 'persistence', 'setup.sql')),
  );
  db.execute(script);
  db.close();

  console.log(`Database was created in ${newPath}`);
  console.log(
    'Set the DB_PATH environment variable to this value and run typewriter again',
  );
  Deno.exit(1);
}

export function validateDbPath(name: string, path?: string) {
  const validateString = (str?: string) => {
    if (str === void 0 || str.trim() === '')
      return new Error(`${name} variable is not set`);
    return str;
  };

  const parseResult = validateString(path);

  if (parseResult instanceof Error) return parseResult;

  try {
    Deno.readFileSync(parseResult);
  } catch {
    return dbFileMissing(parseResult);
  }

  return parseResult;
}
