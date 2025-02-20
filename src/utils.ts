export function unthrow<T>(operation: (...args: unknown[]) => T) {
  try {
    return operation();
  } catch (error) {
    return error as Error;
  }
}

export const encode = (text: string) => new TextEncoder().encode(text);
