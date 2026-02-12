module.exports = {
  coverageReporters: ['json-summary', 'lcov', 'text'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom-global',
};
