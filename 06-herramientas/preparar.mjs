import { readFile, writeFile } from 'node:fs/promises';

// Build local: une los módulos en orden de flujo para soportar también file://.
// Source of truth: editar datos, lógica o interfaz; este archivo generado no se edita.
const root = new URL('../', import.meta.url);
const sources = [
  '01-datos/curriculum.js',
  '02-logica/plan.js',
  '03-interfaz/app.js'
];
const parts = [];
for (const path of sources) {
  const source = await readFile(new URL(path, root), 'utf8');
  parts.push(`// Source section: ${path}\n` + source
    .replace(/^import .*;\r?\n/gm, '')
    .replace(/^export /gm, ''));
}
await writeFile(new URL('03-interfaz/app.bundle.js', root),
  '// Generated entry: compatible con servidor y apertura directa del HTML.\n(() => {\n' + parts.join('\n') + '\n})();\n');
