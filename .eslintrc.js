module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    chrome: 'readonly',
    window: true,
    document: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'jest'],
  rules: {
    'no-console': 'error',
    eqeqeq: 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
