import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: [
    '../src/design-system/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/design-system/**/*.mdx',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  staticDirs: [
    { from: '../public', to: '/public' },
    { from: '../src/app/fonts', to: '/fonts' },
  ],
  core: {
    builder: '@storybook/builder-webpack5',
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config) => {
    // Mock Next.js navigation for Storybook
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/navigation': require.resolve('../.storybook/mocks/next-navigation.js'),
    };

    // @ts-ignore Ensure that CSS handling is set correctly
    const cssRule = config?.module?.rules?.find((rule) => rule?.test && rule?.test.test('.css'));

    if (cssRule) {
      // @ts-ignore Ensure that CSS handling is set correctly
      cssRule?.use?.forEach((useRule) => {
        if (useRule.loader && useRule.loader.includes('css-loader')) {
          useRule.options = {
            ...useRule.options,
            modules: {
              localIdentName: '[name]__[local]___[hash:base64:5]', // Customize classnames
              exportLocalsConvention: 'camelCase', // Enable camelCase for modules
              auto: /\.module\.css$/, // Only treat *.module.css as CSS Modules
            },
          };
        }
      });
    } else {
      // If no CSS rule is found, create a new one
      config?.module?.rules?.push({
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCase',
              },
            },
          },
        ],
      });
    }

    // SVG handling
    const imageRule = config.module?.rules?.find((rule) => {
      const test = (rule as { test: RegExp }).test;
      if (!test) {
        return false;
      }

      return test.test('.svg');
    }) as { [key: string]: any };

    if (imageRule) {
      imageRule.exclude = /\.svg$/;
    }

    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default config;
