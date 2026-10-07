import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  pluginJs.configs.recommended,
];
