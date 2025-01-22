// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['dist', 'node_modules', '.husky/install.mjs', '*.config.mjs'],
    rules: {
      'no-process-env': 'error',
      camelcase: [
        'error',
        {
          properties: 'never',
          ignoreDestructuring: true,
          ignoreImports: true,
          ignoreGlobals: true,
        },
      ],
      'default-case-last': 'error',
      eqeqeq: ['error', 'smart'],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'no-console': 'error',
      'no-multi-assign': 'error',
      'no-nested-ternary': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use named exports instead (i.e. export const foo = ...)',
        },
      ],
    },
  },
);
