import { EnvParse, EnvVars, REQUIRED } from '@/config/config.types.ts';
import { isError, MissingConfigError } from '@/config/config.errors.ts';

export const missingConfigs = (config: Partial<EnvVars>) =>
  new Set(REQUIRED).difference(new Set(Object.keys(config)));

export const definedOnly = (obj: EnvParse) =>
  Object.entries(obj)
    .filter(([_, v]) => !isError(v))
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k as keyof EnvVars]: v as string | boolean,
      }),
      {} as Partial<EnvVars>,
    );

export function parseString(name: string, x?: unknown) {
  if (x === void 0) return new MissingConfigError(name);
  if (typeof x !== 'string')
    return new Error(`${name} expected string, but got ${typeof x}`);
  if (x.trim() === '') return new MissingConfigError(name);
  return x;
}

export function parseBool(name: string, x?: unknown) {
  if (typeof x === 'boolean') return x;
  if (x === void 0 || x === null) return new MissingConfigError(name);

  const textValue = x.toString().toLowerCase().trim();

  switch (textValue) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return new Error(`${name} is not a bool: ${textValue}`);
  }
}

export function makeOptional<T>(x: T, defaultVal: T) {
  if (x instanceof MissingConfigError) return defaultVal;
  return x;
}
