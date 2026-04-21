import { execSync } from 'node:child_process';
import { copyFileSync } from 'node:fs';

execSync('npx rollup -c build/rollup.config.mjs', { stdio: 'inherit' });
copyFileSync('release/appletv_agnative.js', 'appletv_agnative.js');
