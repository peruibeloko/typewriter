import { typewriter } from '@/app/app.module.ts';
import { parseEnv } from '@/app/app.config.ts';
import { DB } from 'sqlite';

const env = parseEnv(Deno.env.toObject());

if (env instanceof Array) {
  console.error('Typewriter failed to read some environment variables');
  console.error(env.reduce((msg, err) => `${msg}- ${err.message}\n`, ''));
  Deno.exit(1);
}

const db = new DB(env.DB_PATH);

Deno.serve(
  {
    port: 3000,
    hostname: '0.0.0.0',
    onListen: ({ port }) => console.log(`Listening on port ${port}`)
  },
  typewriter({ env, db })
);
