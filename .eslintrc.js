const { overrides } = require('@1stg/eslint-config/overrides');

module.exports = {
  extends: '@1stg',
  overrides: [
    ...overrides,
    {
      files: '*.tsx',
      rules: {
        'react/jsx-handler-names': 0,
      },
    },
  ],
  settings: {
    node:{
      allowModules: ['stated-bean']
    },
    polyfills: ['Object.getOwnPropertySymbols', 'Promise', 'Reflect', 'Symbol'],
  },
};
