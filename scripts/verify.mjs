import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import postcss from 'postcss';
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
for (const [name, version] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
  assert.match(version, /^\d+\.\d+\.\d+$/, `Unpinned dependency: ${name}`);
  assert.equal(lock.packages[`node_modules/${name}`].version, version, name);
}
for (const [source, target] of [
  ['jquery/dist/jquery.min.js', 'js/jquery.min.js'],
  ['bootstrap/dist/js/bootstrap.bundle.min.js', 'js/bootstrap.min.js'],
  ['bootstrap/dist/css/bootstrap.min.css', 'css/bootstrap.min.css'],
  ['chart.js/dist/chart.umd.min.js', 'plugins/Chart.js/Chart.min.js'],
  ['fullcalendar/all/global.js', 'plugins/fullcalendar/dist/fullcalendar.min.js'],
  ['moment/moment.js', 'plugins/moment/moment.js']
]) assert.deepEqual(await readFile(`node_modules/${source}`), await readFile(`HTML/assets/${target}`), target);
let count = 0;
for (const filename of (await readdir('HTML')).filter(f => f.endsWith('.html'))) {
  const html = await readFile(`HTML/${filename}`, 'utf8');
  if (!html.includes('assets/js/jquery.min.js')) continue;
  assert.equal((html.match(/src="assets\/js\/jquery-migrate.min.js"/g) || []).length, 1, filename);
  assert.equal((html.match(/src="assets\/js\/legacy-compat.js"/g) || []).length, 1, filename);
  assert.ok(html.indexOf('assets/js/jquery.min.js') < html.indexOf('assets/js/jquery-migrate.min.js'), filename);
  assert.ok(html.indexOf('assets/js/bootstrap.min.js') < html.indexOf('assets/js/legacy-compat.js'), filename);
  assert.doesNotMatch(html, /data-toggle=["'](?:modal|dropdown|collapse|tab|tooltip|popover)["']/, filename);
  for (const ref of html.matchAll(/(?:src|href)=["'](assets\/(?:css\/(?:bootstrap.min|legacy-layout)\.css|js\/(?:jquery.min|jquery-migrate.min|bootstrap.min|legacy-compat)\.js))["']/g)) {
    await readFile(path.join('HTML', ref[1]));
  }
  count++;
}
for (const filename of ['HTML/assets/js/legacy-compat.js', 'HTML/assets/pages/jquery.fullcalendar.js', 'HTML/assets/pages/chartjs.init.js', 'HTML/assets/js/jquery.app.js']) {
  new vm.Script(await readFile(filename, 'utf8'), { filename });
}
const css = postcss.parse(await readFile('HTML/assets/css/legacy-layout.css', 'utf8'));
css.walkRules(rule => assert.ok(rule.selector.trim(), 'Empty compatibility selector'));
console.log(`PASS pinned dependencies, vendored assets, ${count} page migrations, CSS and JavaScript syntax.`);
