import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { renderTemplate } from './component-renderer.mjs';
import { buildPages } from './build-pages.mjs';
const component = (template, defaults = {}) => ({ template, defaults });
test('shared components merge nested defaults and page navigation state', () => {
  const registry = new Map([['sidebar', component('<nav class="{{nav.calendar}}">{{label}}</nav>', { nav: { calendar: '', charts: '' }, label: 'Navigation' })]]);
  assert.equal(renderTemplate('<!-- @component sidebar {"nav":{"calendar":"active"}} -->', registry), '<nav class="active">Navigation</nav>');
});
test('text and attribute props are escaped and never reinterpreted as templates', () => {
  const registry = new Map([['card', component('<div title="{{label}}">{{value}}</div>')]]);
  const props = { label: '\"><script>alert(1)</script>', value: '{{danger}} & <!-- @component sidebar -->' };
  assert.equal(renderTemplate(`<!-- @component card ${JSON.stringify(props)} -->`, registry), '<div title="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;">{{danger}} &amp; &lt;!-- @component sidebar --&gt;</div>');
});
test('nested composition resolves registered components', () => {
  const registry = new Map([['shell', component('<main><!-- @component card --></main>')], ['card', component('<p>Content</p>')]]);
  assert.equal(renderTemplate('<!-- @component shell -->', registry), '<main><p>Content</p></main>');
});
test('unknown components, missing props and malformed directives fail explicitly', () => {
  const registry = new Map([['card', component('{{title}}')]]);
  assert.throws(() => renderTemplate('<!-- @component missing -->', registry), /Unknown component/);
  assert.throws(() => renderTemplate('<!-- @component card -->', registry), /Missing component property/);
  assert.throws(() => renderTemplate('<!-- @component ../secret -->', registry), /Invalid component directive/);
  assert.throws(() => renderTemplate('<!-- @component card {"title":} -->', registry), SyntaxError);
});
test('recursive includes and prototype-related props are rejected', () => {
  const registry = new Map([['loop', component('<!-- @component loop -->')], ['card', component('{{title}}')]]);
  assert.throws(() => renderTemplate('<!-- @component loop -->', registry), /Circular component/);
  assert.throws(() => renderTemplate('<!-- @component card {"__proto__":{"title":"unsafe"}} -->', registry), /Unsafe component property/);
});
test('every existing top-level route is represented exactly once in the source manifest', async () => {
  const manifest = JSON.parse(await readFile('src/pages.json', 'utf8'));
  const routes = (await readdir('HTML')).filter(file => file.endsWith('.html')).sort();
  assert.deepEqual(manifest.pages.map(page => page.output).sort(), routes);
  assert.equal(new Set(manifest.pages.map(page => page.source)).size, routes.length);
  for (const page of manifest.pages) assert.ok(page.source.startsWith(`pages/${page.module}/`));
});
test('generated pages and feature scripts are deterministic and synchronized', async () => {
  const first = await buildPages({ check: true });
  const second = await buildPages({ check: true });
  assert.equal(first.pages, 101);
  assert.equal(first.components, 10);
  assert.equal(first.assets, 5);
  assert.equal(first.changed, 0);
  assert.deepEqual(first, second);
});
