import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';

import restrictDomainImports from './eslint-plugin-domains/restrict-domain-imports.mjs';
import requireIdForSvgImports from './eslint-plugin-svg-id/require-id-for-svg-imports.mjs';

// Helper function to trim whitespace from global keys
function trimGlobals(globalsObj) {
  if (!globalsObj || typeof globalsObj !== 'object') {
    return {};
  }

  return Object.fromEntries(Object.entries(globalsObj).map(([key, value]) => [key.trim(), value]));
}

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '.next/**',
      'next-env.d.ts',
      '**/.git/**',
      '**/coverage/**',
      '**/docs/**',
      'storybook-static/**',
      '!.storybook',
    ],
  },
  { ...eslint.configs.recommended },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...trimGlobals(globals.browser),
        ...trimGlobals(globals.node),
        ...trimGlobals(globals.jest),
        ...trimGlobals(globals.es2020),
        React: 'readonly',
        EventListener: 'readonly',
        NodeJS: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
      next: {
        rootDir: '.',
      },
    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSort,
      'testing-library': testingLibrary,
      '@next/next': nextPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'newline-before-return': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': [
        'warn',
        {
          vars: 'local',
          args: 'none',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_|^[A-Z].*Props$|^key$',
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // React, Next.js and external packages (third-party libraries)
            ['^react', '^next', '^@?\\w'],
            // Internal core, design-system, and domain paths
            ['^@/core/', '^@/design-system/', '^@/domain'],
            // Relative imports - parent imports (../) and current directory imports (./)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Side effect imports
            ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    ignores: ['**/*.stories.*', '**/*.test.*'],
    plugins: {
      'svg-id': {
        rules: {
          'require-id-for-svg-imports': requireIdForSvgImports,
        },
      },
    },
    rules: {
      'svg-id/require-id-for-svg-imports': 'error',
    },
  },
  {
    files: ['src/domains/**/*.{js,ts,jsx,tsx}'],
    plugins: {
      domains: {
        rules: {
          'restrict-domain-imports': restrictDomainImports,
        },
      },
    },
    rules: {
      'domains/restrict-domain-imports': 'error',
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: { 'testing-library': testingLibrary },
    rules: {
      ...testingLibrary.configs.react.rules,
    },
  },
  prettier,
];
