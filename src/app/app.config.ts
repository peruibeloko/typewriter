import { EnvParse, EnvVars } from '@/app/app.types.ts';
import { SQLite } from '@/persistence/sqlite.ts';
import {
  formatErrors,
  getErrors,
  hasErrors,
  isError,
} from '@/app/config/config.errors.ts';
import * as Env from '@/app/config/env.repository.ts';
import * as ConfigFile from '@/app/config/file.repository.ts';
import { missingConfigs } from '@/app/config/config.utils.ts';

const definedOnly = (obj: EnvParse) =>
  Object.entries(obj)
    .filter(([_, v]) => !isError(v))
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k as keyof EnvVars]: v as string | boolean,
      }),
      {} as Partial<EnvVars>,
    );

async function getConfiguration() {
  console.log('Attempting to read configuration from environment...');
  const fromEnv = Env.getConfig();

  if (
    !hasErrors(fromEnv) &&
    missingConfigs(fromEnv as Partial<EnvVars>).size === 0
  ) {
    console.log('Success!');
    return {
      VERBOSE: false, // ? Set defaults
      ...definedOnly(fromEnv), // ? Override using env
    } as EnvVars;
  }

  console.error('Typewriter failed to read some environment variables');
  console.error(formatErrors(getErrors(fromEnv)));

  console.log('Attempting to read remaining values from typewriter.toml...');
  const fromFile = await ConfigFile.getConfig();

  if (fromFile instanceof Error) {
    console.error(fromFile.message);
    Deno.exit(1);
  }

  if (
    !hasErrors(fromFile) &&
    missingConfigs(fromFile as Partial<EnvVars>).size === 0
  ) {
    console.log('Success!');
    return {
      VERBOSE: false, // ? Set defaults
      ...definedOnly(fromFile), // ? Override from config file
      ...definedOnly(fromEnv), // ? Override using env
    } as EnvVars;
  }

  if (hasErrors(fromFile)) {
    console.error('Typewriter failed to read some environment variables');
    console.error(formatErrors(getErrors(fromFile)));
    Deno.exit(1);
  }

  const finalConfig = {
    VERBOSE: false, // ? Set defaults
    ...definedOnly(fromFile), // ? Override from config file
    ...definedOnly(fromEnv), // ? Override using env
  } as EnvVars;

  return finalConfig;
}

const env = await getConfiguration();
const db = SQLite.instance(env.DB_PATH);

export { env, db };
