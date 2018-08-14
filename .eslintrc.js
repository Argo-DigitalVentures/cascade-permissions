module.exports = {
  extends: [
    // 'airbnb',
    // 'eslint:recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
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
    'prettier/prettier': ['error', { singleQuote: true, trailingComma: 'es5' }],
  },
};
