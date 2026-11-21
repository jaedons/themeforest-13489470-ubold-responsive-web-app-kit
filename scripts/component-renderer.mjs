// Build-time HTML composition. No runtime fetches, eval or executable templates.
const includePattern = /<!--\s*@component\s+([a-z0-9/_-]+)(?:\s+(\{[\s\S]*?\}))?\s*-->/g;
const variablePattern = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;
const forbidden = new Set(['__proto__', 'prototype', 'constructor']);
function merge(defaults, overrides) {
  const result = Object.create(null);
  for (const source of [defaults, overrides]) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('Component props must be an object');
    for (const [key, value] of Object.entries(source)) {
      if (forbidden.has(key)) throw new Error(`Unsafe component property: ${key}`);
      result[key] = value && typeof value === 'object' && !Array.isArray(value)
        ? merge(result[key] || {}, value) : value;
    }
  }
  return result;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
export function renderTemplate(template, registry, props = {}, stack = []) {
  // Render includes before substituting text, so user-supplied values can never
  // become executable include directives or another template substitution.
  let output = '';
  let previous = 0;
  const interpolate = fragment => {
    if (/<!--\s*@component\b/.test(fragment)) throw new Error('Invalid component directive');
    return fragment.replace(variablePattern, (_, key) => {
      let value = props;
      for (const part of key.split('.')) {
        if (forbidden.has(part) || value == null || !Object.hasOwn(value, part)) throw new Error(`Missing component property: ${key}`);
        value = value[part];
      }
      if (!['string', 'number', 'boolean'].includes(typeof value)) throw new Error(`Component property must be scalar: ${key}`);
      return escapeHtml(value);
    });
  };
  for (const match of template.matchAll(includePattern)) {
    output += interpolate(template.slice(previous, match.index));
    const name = match[1];
    if (!registry.has(name)) throw new Error(`Unknown component: ${name}`);
    if (stack.includes(name)) throw new Error(`Circular component: ${[...stack, name].join(' -> ')}`);
    const component = registry.get(name);
    const parameters = match[2] ? JSON.parse(match[2]) : {};
    const context = merge(component.defaults || {}, parameters);
    output += renderTemplate(component.template, registry, context, [...stack, name]);
    previous = match.index + match[0].length;
  }
  output += interpolate(template.slice(previous));
  return output;
}
