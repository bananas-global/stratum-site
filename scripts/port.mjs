import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
const { name } = JSON.parse(readFileSync('./package.json', 'utf8'));
const n = createHash('md5').update(name).digest().readUInt16BE(0);
process.stdout.write(String(3000 + (n % 4000)));
