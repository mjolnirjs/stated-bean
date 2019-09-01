const { overrides } = require('@1stg/eslint-config/overrides');

module.exports = {
  extends: '@1stg',
  overrides: [
    ...overrides,
    {
      files: '*.{ts,tsx}',
      rules: {
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/no-floating-promises': 0,
        '@typescript-eslint/no-type-alias': 0,
        'react/jsx-handler-names': 0,
      },
    },
  ],
};
