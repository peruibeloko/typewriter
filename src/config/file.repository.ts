import { ConfigResult, ConfigSchema, EnvVars } from '@/config/config.types.ts';
import { parse } from '@std/toml';
import { safeParse } from 'valibot';
import { ConfigParseError } from '@/config/config.errors.ts';

export async function getConfig(): Promise<ConfigResult> {
  const configFile = await Deno.readTextFile('typewriter.toml').catch(
    () => null,
  );

  if (configFile === null) {
    return {
      success: false,
      error: new Error("Couldn't find a typewriter.toml config file"),
    };
  }

  let rawConfig;
  try {
    rawConfig = parse(configFile) as Partial<EnvVars>;
  } catch (e) {
    return {
      success: false,
      error: new Error(`Config file is malformed: ${(e as Error).message}`),
    };
  }

  const result = safeParse(ConfigSchema, rawConfig);

  if (!result.success) {
    return {
      success: false,
      error: new ConfigParseError('Config file is not valid', result.issues),
    };
  }

  return { success: true, data: result.output };
}
