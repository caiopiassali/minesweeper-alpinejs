module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  'overrides': [],
  'parser': '@typescript-eslint/parser',
  'ignorePatterns': ['*.cjs'],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'project': 'tsconfig.json',
    'tsconfigRootDir': __dirname,
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {},
}
