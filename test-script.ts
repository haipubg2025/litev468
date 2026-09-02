import fs from 'fs';
const code = fs.readFileSync('src/components/Settings.tsx', 'utf-8');
const lines = code.split('\n');
console.log(lines.slice(355, 410).map((l, i) => `${i + 355}: ${l}`).join('\n'));
