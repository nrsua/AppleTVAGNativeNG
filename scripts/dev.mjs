import { execSync } from 'node:child_process';

execSync('npx rollup -c build/rollup.config.mjs -w', { stdio: 'inherit' });
