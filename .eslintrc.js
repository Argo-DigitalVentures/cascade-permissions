module.exports = {
  extends: ['plugin:jest/recommended', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  plugins: ['import', 'jest', 'prettier'],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
  env: {
    es6: true,
    'jest/globals': true,
    node: true,
  },
  rules: {
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'prettier/prettier': ['error', { printWidth: 140, singleQuote: true, trailingComma: 'all' }],
  },
};
