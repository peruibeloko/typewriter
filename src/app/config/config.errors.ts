export class MissingConfigError extends Error {
  override name = 'MissingConfigError';

  constructor(propName: string) {
    super(`${propName} variable is not set`);
  }
}

export const formatErrors = (errArr: Error[]) =>
  errArr.reduce((msg, err) => `${msg}- ${err.message}\n`, '');

export const isError = (x: unknown) => x instanceof Error;

export const hasErrors = (x: Record<string, unknown>) =>
  Object.values(x).some(isError);

export const getErrors = (x: Record<string, unknown>) =>
  Object.values(x).filter(isError);
