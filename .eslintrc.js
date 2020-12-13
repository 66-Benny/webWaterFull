module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': 'off',
    'no-param-reassign': 'off',
    'import/no-unresolved': [2],
    'import/extensions': [
      'never',
      'always',
      {
        ignorePackages: true,
        'scm-sdk': 'never',
        js: 'never',
        vue: 'never',
      },
    ],
    'linebreak-style': [0, 'error', 'windows'],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};