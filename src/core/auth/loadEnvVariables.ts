import { loadEnvConfig } from '@next/env';

import type { ParsedEnv } from '@/core';

/**
 * Loads environment variables from the project's configuration files.
 *
 * Uses `@next/env` to load environment variables based on the current working directory
 * and environment mode (development or production).
 *
 * @returns A promise that resolves to a {@link ParsedEnv} object containing the parsed environment variables.
 *
 * @example
 * const env = await loadEnvVariables();
 * console.log(env.BASE_URL_PROD);
 *
 * @see {@link ParsedEnv}
 */

export const loadEnvVariables = (): ParsedEnv => {
  const projectDir = process.cwd();

  const isDev = process.env.NODE_ENV !== 'production';

  const env = loadEnvConfig(projectDir, isDev);

  const result = env.loadedEnvFiles[0].contents
    .split('\n')
    .reduce((acc: { [key: string]: string }, line) => {
      const [key, value] = line.split('=').map((str) => str.trim());
      if (key) {
        acc[key] = value?.replace(/^"|"$/g, '');
      }

      return acc;
    }, {});

  if (!result.NODE_ENV) result.NODE_ENV = process.env.NODE_ENV;

  return result;
};
