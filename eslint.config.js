// eslint.config.js
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: ['dist/', 'node_modules/', 'eslint.config.js'],
  files: ['**/*.ts'],
  extends: [...tseslint.configs.recommended],
}); 