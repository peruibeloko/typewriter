export class MissingConfigError extends Error {
  override name = 'MissingConfigError';

  constructor(propName: string) {
    super(`${propName} variable is not set`);
  }
}

export class ConfigParseError<T> extends Error {
  override name = 'ConfigParseError';
  issues: T;

  constructor(message: string, issues: T) {
    super(message);
    this.issues = issues;
  }
}

export function formatErrors(err: Error) {
  if (err instanceof ConfigParseError) {
    return err.issues; // TODO
  } else {
    err.message;
  }
}

export const isError = (x: unknown) => x instanceof Error;

export const hasErrors = (x: Record<string, unknown>) =>
  Object.values(x).some(isError);

export const getErrors = (x: Record<string, unknown>) =>
  Object.values(x).filter(isError);
