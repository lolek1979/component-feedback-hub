import createNextIntlPlugin from 'next-intl/plugin';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import './src/core/lib/env/env.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const withNextIntl = createNextIntlPlugin('./src/core/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  turbopack: {
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  sassOptions: {
    includePaths: ['./src'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      crypto: false,
    };

    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = 'camelCase';
        }
      });

    // SVGR configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

export default withNextIntl(nextConfig);
