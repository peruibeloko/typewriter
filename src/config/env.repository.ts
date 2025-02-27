import { ConfigResult, EnvSchema } from '@/config/config.types.ts';
import { safeParse } from 'valibot';
import { ConfigParseError } from '@/config/config.errors.ts';

export function getConfig(): ConfigResult {
  const rawEnv = Deno.env.toObject();

  const result = safeParse(EnvSchema, rawEnv);

  if (!result.success) {
    return {
      success: false,
      error: new ConfigParseError(
        'Environment variables are not valid',
        result.issues,
      ),
    };
  }

  return {
    success: true,
    data: result.output,
  };
}
