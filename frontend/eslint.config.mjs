import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import next from 'eslint-plugin-next';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  next.configs.recommended // Add this line to include Next.js plugin
);