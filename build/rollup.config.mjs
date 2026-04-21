import { defineConfig } from 'rollup';

export default defineConfig({
  input: 'src/index.js',
  output: {
    file: 'release/appletv_agnative.js',
    format: 'iife',
    name: 'AppleTVAgNative'
  },
  treeshake: false
});
