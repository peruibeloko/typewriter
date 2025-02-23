import { EnvParse } from '@/app/app.types.ts';
import { parseBool, parseString } from '@/app/config/config.utils.ts';
import { validateDbPath } from '@/persistence/sqlite.service.ts';

export function getConfig() {
  const rawEnv = Deno.env.toObject();

  const parseResult: EnvParse = {
    DB_PATH: validateDbPath('TYPEWRITER_DB_PATH', rawEnv.TYPEWRITER_DB_PATH),
    JWT_SECRET: parseString(
      'TYPEWRITER_JWT_SECRET',
      rawEnv.TYPEWRITER_JWT_SECRET,
    ),
  };

  if (rawEnv.TYPEWRITER_VERBOSE === void 0) return parseResult;

  parseResult.VERBOSE = parseBool('VERBOSE', rawEnv.TYPEWRITER_VERBOSE);
  return parseResult;
}
