import { formatErrors } from '@/config/config.errors.ts';
import * as Env from '@/config/env.repository.ts';
import * as ConfigFile from '@/config/file.repository.ts';
import { SQLite } from '@/persistence/sqlite.model.ts';

async function getConfiguration() {
  console.log('Reading local configuration (typewriter.toml)');

  const fromFile = await ConfigFile.getConfig();
  if (fromFile.success) return fromFile.data;

  console.error('Read failed');
  console.error(formatErrors(fromFile.error));

  console.log('Reading global configuration (environment variables)');

  const fromEnv = Env.getConfig();
  if (fromEnv.success) return fromEnv.data;

  console.error('Read failed');
  console.error(formatErrors(fromEnv.error));

  console.error(
    "Couldn't find any suitable configuration source, " +
      'please provide either environment variables ' +
      'or a typewriter.toml file and restart typewriter',
  );

  Deno.exit(1);
}

const env = await getConfiguration();
const db = SQLite.instance(env.DB_PATH);

export { db, env };
