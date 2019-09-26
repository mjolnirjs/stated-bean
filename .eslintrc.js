module.exports = {
  root: true,
  extends: '@1stg/eslint-config/recommended',
  settings: {
    node: {
      allowModules: ['stated-bean'],
    },
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/no-unnecessary-condition': 0,
    'react/jsx-handler-names': 0,
  },
};
