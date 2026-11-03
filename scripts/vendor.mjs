import { copyFile, mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const files = {
  'bootstrap/dist/css/bootstrap.min.css': 'HTML/assets/css/bootstrap.min.css',
  'bootstrap/dist/js/bootstrap.bundle.min.js': 'HTML/assets/js/bootstrap.min.js',
  'bootstrap/dist/js/bootstrap.bundle.js': 'HTML/assets/js/bootstrap.js',
  'jquery/dist/jquery.min.js': 'HTML/assets/js/jquery.min.js',
  'jquery-migrate/dist/jquery-migrate.min.js': 'HTML/assets/js/jquery-migrate.min.js',
  'chart.js/dist/chart.umd.js': 'HTML/assets/plugins/Chart.js/Chart.js',
  'fullcalendar/all/global.js': 'HTML/assets/plugins/fullcalendar/dist/fullcalendar.min.js',
  'fullcalendar/skeleton.css': 'HTML/assets/plugins/fullcalendar/dist/fullcalendar.css',
  'fullcalendar/themes/classic/global.js': 'HTML/assets/plugins/fullcalendar/dist/classic.js',
  'fullcalendar/themes/classic/theme.css': 'HTML/assets/plugins/fullcalendar/dist/classic.css',
  'fullcalendar/themes/classic/palette.css': 'HTML/assets/plugins/fullcalendar/dist/palette.css',
  'moment/moment.js': 'HTML/assets/plugins/moment/moment.js',
  'moment/min/moment.min.js': 'HTML/assets/plugins/moment/min/moment.min.js',
  'jquery-ui-dist/jquery-ui.min.js': 'HTML/assets/plugins/jquery-ui/jquery-ui.min.js',
  'jquery-ui-dist/jquery-ui.js': 'HTML/assets/plugins/jquery-ui/jquery-ui.js'
};
for (const [source, target] of Object.entries(files)) {
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(path.join('node_modules', source), target);
}
await copyFile('node_modules/chart.js/dist/chart.umd.min.js', 'HTML/assets/plugins/Chart.js/Chart.min.js');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
for (const name of Object.keys(pkg.dependencies)) {
  const dir = path.join('node_modules', name);
  const license = (await readdir(dir)).find(file => /^licen[sc]e(?:\.|$)/i.test(file));
  if (license) {
    await mkdir('HTML/assets/vendor-licenses', { recursive: true });
    await copyFile(path.join(dir, license), `HTML/assets/vendor-licenses/${name.replaceAll('/', '-')}.txt`);
  }
}
const manifest = { generatedBy: 'npm run vendor', dependencies: pkg.dependencies, devDependencies: pkg.devDependencies };
await writeFile('DEPENDENCIES.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Vendored pinned dependencies into HTML/assets.');
