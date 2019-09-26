module.exports = {
  root: true,
  extends: '@1stg/eslint-config/recommended',
  settings: {
    node: {
      allowModules: ['stated-bean'],
    },
    polyfills: ['Object.getOwnPropertySymbols', 'Promise', 'Reflect', 'Symbol'],
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',
  },
};
