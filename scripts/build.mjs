import { mkdir, cp, writeFile } from 'node:fs/promises';
import { validateBank,validateAdditionalBanks } from './validate.mjs';
await validateBank();
await validateAdditionalBanks();
await mkdir('dist', { recursive: true });
await cp('site', 'dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await writeFile('dist/.nojekyll', '');
console.log('Built Recall Lab → dist/');
