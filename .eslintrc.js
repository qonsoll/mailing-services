module.exports = {
    extends: ['react-app', 'prettier'],
    root: true,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        legacyDecorators: true,
        jsx: true
      }
    },
    env: {
      node: true
    },
    parser: '@typescript-eslint/parser',
    plugins: ['import', 'react', 'react-hooks', 'prettier', '@typescript-eslint'],
    settings: {
      react: {
        version: '17'
      },
      'import/resolver': {
        node: {
          moduleDirectory: ['node_modules', '/'],
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    rules: {
      semi: [2, 'never'],
      'no-console': 'error',
      'react/forbid-prop-types': 0,
      'react/require-default-props': 0,
      'react/jsx-filename-extension': 0,
      'import/no-named-as-default': 0,
      'no-return-await': 2,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 0,
      'import/no-anonymous-default-export': 0,
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'angle-bracket'
        }
      ],
      'prettier/prettier': 'error'
    },
    overrides: [
      {
        files: ['*.test.ts'],
        rules: {
          'import/first': 'off'
        }
      }
    ]
  }