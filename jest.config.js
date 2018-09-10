module.exports = {
  roots: ['<rootDir>'],
  // testPathIgnorePatterns: ['/node_modules/', './lib/util'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    // '^.+\\.(j|t)sx?$': 'ts-jest',
    // '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    // '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(j|t)sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    // Change MODULE_NAME_HERE to your module that isn't being compiled
    '/node_modules/(?!MODULE_NAME_HERE).+\\.js$',
  ],
};
