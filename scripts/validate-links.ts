import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
async function files(directory:string):Promise<string[]> {
  const entries = await readdir(directory);
  const nested = await Promise.all(entries.map(async (name) => {
    const path = join(directory, name);
    return (await stat(path)).isDirectory() ? files(path) : [path];
  }));
  return nested.flat();
}
const htmlFiles = await files('dist'); const known = new Set(htmlFiles.map((file) => `/${file.replace(/^dist\//,'').replace(/index\.html$/,'')}`)); const broken = new Set<string>();
const base = (process.env.PUBLIC_BASE_PATH || '/').replace(/\/$/, '');
for (const file of htmlFiles.filter((f) => f.endsWith('.html'))) { const html=await readFile(file,'utf8'); for (const match of html.matchAll(/href="(\/[^"#?]+)"/g)) { const href=match[1]; if (/\.[a-z0-9]+$/i.test(href)) continue; const local = base && href.startsWith(`${base}/`) ? href.slice(base.length) : href; if (!known.has(local) && !known.has(`${local}/`)) broken.add(`${file}: ${href}`); } }
if (broken.size) { console.error([...broken].join('\n')); process.exit(1); } console.log(`Validated ${htmlFiles.length} generated files.`);
