// You can learn more about each option below in the Jest docs: https://jestjs.io/docs/configuration.

module.exports = {
  roots: ['<rootDir>'],
  testEnvironment: 'jest-environment-jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>[/\\\\](node_modules|.next)[/\\\\]',
    '<rootDir>/.jest/test-utils.tsx',
    '<rootDir>/__mocks__/*',
    '/node_modules/(?!@react-pdf/renderer|use-intl|next-intl)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!use-intl|next-intl|@t3-oss)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx|mjs)$': [
      'babel-jest',
      {
        presets: [
          [
            'next/babel',
            {
              'preset-react': {
                runtime: 'automatic',
              },
            },
          ],
        ],
      },
    ],
  },
  watchPlugins: ['jest-watch-typeahead/filename'],
  collectCoverage: false,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ['json', 'html'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.*',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/src/design-system/**/*.stories.*',
    '!<rootDir>/src/pages/_app.tsx',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svg.js',
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': `<rootDir>/__mocks__/fileMock.js`,

    '@react-pdf/renderer': '<rootDir>/__mocks__/@react-pdf/renderer.js',
    '^nuqs$': '<rootDir>/__mocks__/nuqs.js',
    '^@/stores/cscAuthStore$': '<rootDir>/__mocks__/@stores/cscAuthStore.js',
    '^@/hooks/useCSCAuth$': '<rootDir>/__mocks__/@hooks/useCSCAuth.js',

    // Handle module aliases
    '@/i18n/(.*)$': '<rootDir>/src/core/i18n/$1',
    '@/messages/(.*)$': '<rootDir>/src/core/messages/$1',
    '@/providers/(.*)$': '<rootDir>/src/core/providers/$1',
    '@/conf': '<rootDir>/src/core/config/$1',
    '@/services/(.*)$': '<rootDir>/src/core/auth/$1',
    '@/rszp/(.*)$': '<rootDir>/src/domains/administrative-proceedings/api/services/AdminProcess/$1',
    '@/api/(.*)$': '<rootDir>/src/core/api/$1',
    '^@/domain-administrative-proceedings/(.*)$':
      '<rootDir>/src/domains/administrative-proceedings/$1',
    '^@/domain-audit-log/(.*)$': '<rootDir>/src/domains/audit-log/$1',
    '^@/domain-central-codelist-management/(.*)$':
      '<rootDir>/src/domains/central-codelist-management/$1',
    '^@/domain-electronic-requests/(.*)$': '<rootDir>/src/domains/electronic-requests/$1',
    '^@/domain-limits-copayments-center/(.*)$': '<rootDir>/src/domains/limits-copayments-center/$1',
    '^@/domain-pdf-comparison/(.*)$': '<rootDir>/src/domains/pdf-comparison/$1',
    '^@/domain-settings/(.*)$': '<rootDir>/src/domains/settings/$1',
    '^@/domain-home/(.*)$': '<rootDir>/src/domains/home/$1',
    '^@/domain-log-out/(.*)$': '<rootDir>/src/domains/log-out/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/design-system/(.*)$': '<rootDir>/src/design-system/$1',
    '^@/domains/(.*)$': '<rootDir>/src/domains/$1',
    '^@/utils/(.*)$': '<rootDir>/src/core/utils/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/core/hooks/$1',
    '^@/stores/(.*)$': '<rootDir>/src/core/stores/$1',
    '^@/tests/(.*)$': '<rootDir>/src/core/tests/$1',
    '^@/mocks/(.*)$': '<rootDir>/__mocks__/$1',
  },
  reporters: ['default', 'jest-junit'],
};
