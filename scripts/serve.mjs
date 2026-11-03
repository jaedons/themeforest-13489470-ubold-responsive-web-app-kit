import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('HTML');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2' };
export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const filename = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
      if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      const data = await readFile(filename);
      res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream' });
      res.end(data);
    } catch { res.writeHead(404).end('Not found'); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('scripts/serve.mjs')) {
  createServer().listen(4173, '127.0.0.1', () => console.log('Ubold: http://127.0.0.1:4173'));
}
