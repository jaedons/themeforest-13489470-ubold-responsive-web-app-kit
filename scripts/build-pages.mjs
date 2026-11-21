import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTemplate } from './component-renderer.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = path.join(root, 'src');
function sourcePath(relative) {
  const filename = path.resolve(sourceRoot, relative);
  if (!filename.startsWith(sourceRoot + path.sep)) throw new Error(`Source outside src/: ${relative}`);
  return filename;
}
export async function buildPages({ check = false } = {}) {
  const manifest = JSON.parse(await readFile(path.join(sourceRoot, 'pages.json'), 'utf8'));
  const definitions = JSON.parse(await readFile(path.join(sourceRoot, 'components.json'), 'utf8'));
  const registry = new Map();
  for (const [name, definition] of Object.entries(definitions)) {
    registry.set(name, { template: await readFile(sourcePath(definition.source), 'utf8'), defaults: definition.defaults || {} });
  }
  const outputs = new Map();
  for (const page of manifest.pages) {
    if (!/^[a-zA-Z0-9_-]+\.html$/.test(page.output)) throw new Error(`Unsafe output: ${page.output}`);
    const output = `HTML/${page.output}`;
    if (outputs.has(output)) throw new Error(`Duplicate page output: ${output}`);
    const source = await readFile(sourcePath(page.source), 'utf8');
    outputs.set(output, renderTemplate(source, registry));
  }
  for (const asset of manifest.assets) {
    if (!/^HTML\/assets\/[a-zA-Z0-9/_.-]+\.js$/.test(asset.output) || asset.output.split('/').includes('..')) throw new Error(`Unsafe asset output: ${asset.output}`);
    if (outputs.has(asset.output)) throw new Error(`Duplicate asset output: ${asset.output}`);
    outputs.set(asset.output, await readFile(sourcePath(asset.source), 'utf8'));
  }
  // Validate every source before writing any output, so invalid includes do not
  // leave a partially rendered site behind.
  const changed = [];
  for (const [relative, content] of outputs) {
    const filename = path.join(root, relative);
    let existing;
    try { existing = await readFile(filename, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (existing?.replaceAll('\r\n', '\n') !== content.replaceAll('\r\n', '\n')) {
      changed.push(relative);
      if (!check) await writeFile(filename, content);
    }
  }
  if (check && changed.length) throw new Error(`Generated outputs are stale. Run npm run build:pages:\n${changed.join('\n')}`);
  return { pages: manifest.pages.length, components: registry.size, assets: manifest.assets.length, changed: changed.length };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildPages({ check: process.argv.includes('--check') });
  console.log(`PASS ${result.pages} pages, ${result.components} shared components, ${result.assets} scripts; ${result.changed} outputs ${process.argv.includes('--check') ? 'out of sync' : 'updated'}.`);
}
