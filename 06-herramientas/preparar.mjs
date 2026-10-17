import { build } from 'esbuild';

// Build entry: resuelve imports y crea una entrada clásica compatible con GitHub Pages.
// Source of truth: editar módulos; nunca modificar app.bundle.js manualmente.
await build({
  entryPoints: [new URL('../03-interfaz/app.js', import.meta.url).pathname],
  outfile: new URL('../03-interfaz/app.bundle.js', import.meta.url).pathname,
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2022'],
  minify: false,
  legalComments: 'eof'
});
