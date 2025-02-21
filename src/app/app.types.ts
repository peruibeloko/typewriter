import { DB } from 'sqlite';

export interface Typewriter {
  Variables: {
    page: number;
    size: number;
    env: EnvVars;
  };
}

export interface EnvVars {
  JWT_SECRET: string;
  DB_PATH: string;
  VERBOSE: boolean;
}

export interface Config {
  env: EnvVars;
  db: DB;
}
