/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  // Timeout aumentato per i test di integrazione con DB
  testTimeout: 30000,
  // Setup file globale per i test
  globalSetup: './__tests__/integration/setup.ts',
};
