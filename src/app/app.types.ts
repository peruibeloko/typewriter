import { DB } from 'sqlite';

export const REQUIRED: (keyof RequiredVars)[] = [
  'DB_PATH',
  'JWT_SECRET',
] as const;

export interface RequiredVars {
  DB_PATH: string;
  JWT_SECRET: string;
}

export const OPTIONAL: (keyof OptionalVars)[] = ['VERBOSE'] as const;

export type OptionalVars = Partial<{
  VERBOSE: boolean;
}>;

export type EnvVars = RequiredVars & OptionalVars;

export type EnvParse = {
  DB_PATH: string | Error;
  JWT_SECRET: string | Error;
  VERBOSE?: boolean | Error;
};

export interface Config {
  env: EnvVars;
  db: DB;
}

export interface Typewriter {
  Variables: {
    page: number;
    size: number;
    env: EnvVars;
  };
}
