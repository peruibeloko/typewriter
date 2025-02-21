import { EnvVars } from '@/app/app.types.ts';
import { DB } from 'sqlite';
import { format, join, normalize, parse } from 'std/path';

const isError = (x: unknown) => x instanceof Error;

export function parseEnv(env: Record<string, string | undefined>): EnvVars | Error[] {
  const dbPath = parseDbPath(env['DB_PATH']);
  const jwtSecret = parseString('JWT_SECRET', env['JWT_SECRET']);
  const verbose = parseBool('VERBOSE', env['VERBOSE']);

  const errors = [dbPath, jwtSecret, verbose].filter(isError);

  if (errors.length > 0) return errors;

  return {
    DB_PATH: dbPath as string,
    JWT_SECRET: jwtSecret as string,
    VERBOSE: verbose as boolean
  };
}

function parseString(name: string, str?: string) {
  if (!str) return new Error(`${name} variable is not set`);
  return str;
}

function parseBool(name: string, str?: string) {
  const concreteVal = parseString(name, str);

  if (concreteVal instanceof Error) return concreteVal;
  return concreteVal.toLowerCase().trim() === 'true' ? true : false;
}

function parseDbPath(path?: string) {
  const concretePath = parseString('DB_PATH', path);

  if (concretePath instanceof Error) return concretePath;

  try {
    Deno.readFileSync(concretePath);
  } catch {
    dbFileMissing(concretePath);
  }

  return concretePath;
}

function dbFileMissing(path: string) {
  console.log('DB_PATH does not point to a file');
  const shouldCreate = confirm('Would you like to create the database file now?');

  if (!shouldCreate) return;

  const newPath = join(path, 'typewriter.db');
  const db = new DB(newPath);

  const script = Deno.readTextFileSync(normalize(join('src', 'persistence', 'setup.sql')));
  db.execute(script);
  db.close();

  console.log(`Database was created in ${newPath}`);
  console.log('Set the DB_PATH environment variable to this value and run typewriter again');
  Deno.exit(1);
}
