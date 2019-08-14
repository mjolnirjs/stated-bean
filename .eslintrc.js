const { overrides } = require('eslint-config-1stg/overrides');

module.exports = {
  extends: '1stg',
  overrides: [
    ...overrides,
    {
      files: '*.{ts,tsx}',
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/member-naming': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/no-type-alias': 0,
        'standard/no-callback-literal': 0,
        '@typescript-eslint/no-floating-promises': 0,
        '@typescript-eslint/restrict-plus-operands': 0,
      },
    },
  ],
};
