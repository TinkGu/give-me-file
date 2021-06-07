module.exports = {
  root: true,
  extends: 'eslint:recommended',
  env: {
    commonjs: true,
    node: true,
    es6: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 'off',
    curly: 'warn',
  },
};
