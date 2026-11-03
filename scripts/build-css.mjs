import less from 'less';
import { readFile, writeFile } from 'node:fs/promises';
for (const name of ['core', 'components', 'pages', 'responsive', 'icons']) {
  const filename = `HTML/assets/less/${name}.less`;
  const source = (await readFile(filename, 'utf8')).replace(/@import url\(/g, '@import (css) url(');
  const result = await less.render(source, {
    filename, math: 'always', javascriptEnabled: false
  });
  await writeFile(`HTML/assets/css/${name}.css`, result.css);
  console.log(`Built ${name}.css with Less ${less.version.join('.')}`);
}
