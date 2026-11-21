import { watch } from 'node:fs';
import { buildPages } from './build-pages.mjs';
import { createServer } from './serve.mjs';
await buildPages();
const server = createServer();
server.listen(4173, '127.0.0.1', () => console.log('Ubold: http://127.0.0.1:4173 (watching src/)'));
let pending = false;
let building = false;
let timer;
async function rebuild() {
  pending = true;
  if (building) return;
  building = true;
  try {
    while (pending) {
      pending = false;
      try { console.log('Rebuilt', await buildPages()); }
      catch (error) { console.error('Build failed; last valid output preserved:', error.message); }
    }
  } finally { building = false; }
}
const watcher = watch(new URL('../src/', import.meta.url), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(rebuild, 80);
});
function stop() { clearTimeout(timer); watcher.close(); server.close(); }
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
