module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "chrome": "readonly",
    "window": "readonly",
    "document": "readonly",
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
        "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module",
    "project": "./tsconfig.json",
  },
  "plugins": [
    "react",
    "@typescript-eslint",
  ],
  "rules": {
    "no-console": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/jsx-uses-react": [1],
  }
};