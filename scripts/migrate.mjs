import { readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import postcss from 'postcss';
// Preserve only selectors absent from Bootstrap 5. Source is the pre-upgrade
// commit, so rerunning this script cannot extract from the new distribution.
const oldCss = execFileSync('git', ['show', '2329f78:HTML/assets/css/bootstrap.min.css'], { encoding: 'utf8' });
const tree = postcss.parse(oldCss);
const legacy = /\.(?:panel(?:-|\b)|well\b|navbar(?:-|\b)|nav(?:>|\s)|nav-stacked|nav-justified|navbar-form|input-group-(?:addon|btn)|form-(?:group|horizontal|inline)|control-label|help-block|checkbox\b|radio\b|has-(?:error|warning|success)|btn-(?:default|xs)|label(?:-|\b)|badge\b|pull-(?:left|right)|text-(?:left|right)|center-block|hidden(?:-|\b)|visible-|img-(?:responsive|circle|rounded)|table-condensed|pagination>|pager\b|list-inline>|media(?:-|\b)|close\b|caret\b|glyphicon|col-xs-|col-(?:sm|md|lg)-(?:offset|push|pull)-)/;
tree.walkComments(n => n.remove());
tree.walkRules(rule => {
  const selectors = rule.selectors.filter(s => legacy.test(s));
  if (!selectors.length) rule.remove();
  else rule.selectors = selectors;
});
tree.walkAtRules(rule => {
  if (rule.name === 'font-face' && !rule.toString().includes('Glyphicons')) rule.remove();
  else if (rule.nodes && !rule.nodes.length) rule.remove();
});
await writeFile('HTML/assets/css/legacy-layout.css', '/* Presentation bridge for removed Bootstrap 3 selectors; Bootstrap 5 owns components. */\n' + tree.toString() + '\n' + `
html { font-size: 14px; }
body { font-size: 14px; line-height: 1.42857143; }
.row { --bs-gutter-x: 30px; }
.modal.show .modal-dialog { transform: none; }
.modal-header { display: block; }
.modal-header .close { float: right; }
.dropdown-menu.show { display: block; }
.navbar .container { display: block; }
.topbar .navbar { display: block; padding: 0; }
.topbar .navbar .container { width: auto; max-width: none; }
.topbar .navbar-nav { flex-direction: row; }
.nav-tabs > li > a { display: block; padding: 10px 15px; }
.nav-tabs > li > a.active { background: #fff; border-bottom: 2px solid #5fbeaa; }
.tab-content > .active { display: block; }
.collapse.show { display: block; }
.progress-bar { float: left; }
.progress { display: block; }
.btn-default { background: #fff; border: 1px solid #ccc; color: #333; }
.label { display: inline; }
.label-default { background: #777; }
.label-primary { background: #5d9cec; }
.label-success { background: #81c868; }
.label-info { background: #34d3eb; }
.label-warning { background: #ffbd4a; }
.label-danger { background: #f05050; }
`);

async function migrate(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (dir !== 'HTML' || entry.name === 'email-templates') await migrate(file); continue; }
    if (!file.endsWith('.html')) continue;
    let html = await readFile(file, 'utf8');
    if (html.includes('assets/js/legacy-compat.js')) continue;
    if (!html.includes('assets/js/jquery')) continue;
    const prefix = dir.startsWith('Documentation') ? '../HTML/' : dir.includes('email-templates') ? '../' : '';
    html = html.replace(/(<script\s+src=["'][^"']*assets\/js\/jquery(?:\.min)?\.js["'][^>]*><\/script>)/, '$1\n        <script src="' + prefix + 'assets/js/jquery-migrate.min.js"></script>');
    html = html.replace(/(<script\s+src=["'][^"']*assets\/js\/bootstrap(?:\.min)?\.js["'][^>]*><\/script>)/, '$1\n        <script src="' + prefix + 'assets/js/legacy-compat.js"></script>');
    html = html.replace(/(<link[^>]*href=["'][^"']*assets\/css\/bootstrap\.min\.css["'][^>]*>)/, '$1\n        <link href="' + prefix + 'assets/css/legacy-layout.css" rel="stylesheet">');
    html = html.replace(/data-toggle=(["'])(modal|dropdown|collapse|tab|pill|tooltip|popover|button|buttons)\1/g, 'data-bs-toggle="$2"')
      .replace(/data-(dismiss|target|parent|ride|slide|slide-to|interval|backdrop|keyboard|placement|trigger|content|container|spy|offset)=/g, 'data-bs-$1=');
    html = html.replace(/<link[^>]*href=["']assets\/plugins\/fullcalendar\/dist\/fullcalendar\.css["'][^>]*>/, '$&\n        <link href="assets/plugins/fullcalendar/dist/classic.css" rel="stylesheet">\n        <link href="assets/plugins/fullcalendar/dist/palette.css" rel="stylesheet">');
    html = html.replace(/(<script[^>]*src=["']assets\/plugins\/fullcalendar\/dist\/fullcalendar\.min\.js["'][^>]*><\/script>)/, '$1\n        <script src="assets/plugins/fullcalendar/dist/classic.js"></script>');
    await writeFile(file, html);
  }
}
await migrate('HTML');
await migrate('Documentation');
let core = await readFile('HTML/assets/js/jquery.core.js', 'utf8');
core = core.replaceAll('[data-toggle="tooltip"]', '[data-bs-toggle="tooltip"]').replaceAll('[data-toggle="popover"]', '[data-bs-toggle="popover"]');
await writeFile('HTML/assets/js/jquery.core.js', core);
console.log('Migrated page references and component attributes.');
