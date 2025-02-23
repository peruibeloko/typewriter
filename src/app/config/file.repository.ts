import { EnvParse, EnvVars } from '@/app/app.types.ts';
import { parseBool, parseString } from '@/app/config/config.utils.ts';
import { validateDbPath } from '@/persistence/sqlite.service.ts';
import { parse } from '@std/toml';

export async function getConfig() {
  const configFile = await Deno.readTextFile('typewriter.toml').catch(
    () => null,
  );

  if (configFile === null) {
    return new Error(
      'Config file is missing, please either set the environment variables, ' +
        'or create a typewriter.toml config file and run typewriter again',
    );
  }

  let rawConfig;
  try {
    rawConfig = parse(configFile) as Partial<EnvVars>;
  } catch (e) {
    return new Error(`Config. file is malformed: ${(e as Error).message}`);
  }

  const parseResult: EnvParse = {
    DB_PATH: validateDbPath('DB_PATH', rawConfig.DB_PATH),
    JWT_SECRET: parseString('JWT_SECRET', rawConfig.JWT_SECRET),
  };

  if (rawConfig.VERBOSE === void 0) return parseResult;

  parseResult.VERBOSE = parseBool('VERBOSE', rawConfig.VERBOSE);

  return parseResult;
}
