import { join, normalize } from '@std/path';
import * as v from 'valibot';

const isDirectory = (path: string) => {
  try {
    Deno.readDirSync(path);
    return true;
  } catch {
    return false;
  }
};

const fileExists = (path: string) => {
  try {
    Deno.readFileSync(path);
    return true;
  } catch {
    return false;
  }
};

const DEFAULTS = {
  DB_PATH: join(...[normalize(Deno.cwd()), 'typewriter.db']),
  VERBOSE: false,
};

const dbPathSchema = v.fallback(
  v.union([
    v.pipe(v.string(), v.check(isDirectory)),
    v.pipe(v.string(), v.check(fileExists)),
  ]),
  DEFAULTS.DB_PATH,
);

const jwtSecretSchema = (message: string) =>
  v.pipe(v.string(), v.nonEmpty(message));

export const EnvSchema = v.pipe(
  v.object({
    TYPEWRITER_JWT_SECRET: jwtSecretSchema('TYPEWRITER_JWT_SECRET is not set'),
    TYPEWRITER_DB_PATH: dbPathSchema,
    TYPEWRITER_VERBOSE: v.pipe(
      v.optional(v.string(), 'false'),
      v.trim(),
      v.toLowerCase(),
      v.regex(/^(?:true|false)$/),
      v.transform((x) => (x === 'true' ? true : false)),
    ),
  }),
  v.transform((old) => ({
    JWT_SECRET: old.TYPEWRITER_JWT_SECRET,
    DB_PATH: old.TYPEWRITER_DB_PATH,
    VERBOSE: old.TYPEWRITER_VERBOSE,
  })),
);

export const ConfigSchema = v.object({
  JWT_SECRET: jwtSecretSchema('JWT_SECRET is not set'),
  DB_PATH: dbPathSchema,
  VERBOSE: v.optional(v.boolean(), false),
});

export type EnvVars = {
  JWT_SECRET: string;
  DB_PATH: string;
  VERBOSE: boolean;
};

export type ConfigResult =
  | { success: true; data: EnvVars }
  | { success: false; error: Error };
