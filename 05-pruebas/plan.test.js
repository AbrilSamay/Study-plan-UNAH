import test from 'node:test';
import assert from 'node:assert/strict';
import { curriculum } from '../01-datos/curriculum.js';
import { normalize, missing, status, totalUV, parseBackup } from '../02-logica/plan.js';
// Regression checks: verifica cadenas, PPS y compatibilidad de backups originales.
test('el catálogo tiene códigos únicos y requisitos existentes', () => {
  assert.equal(new Set(curriculum.map(c => c.code)).size, curriculum.length);
  for (const course of curriculum) for (const code of course.req) assert.ok(code === 'ALL_PREV' || curriculum.some(c => c.code === code));
  assert.equal(totalUV, 216);
});
test('aprobar una materia abre su siguiente paso', () => {
  const progress = normalize({});
  const course = curriculum.find(c => c.code === 'ISC-102');
  assert.equal(status(course, progress), 'LOCKED');
  progress['ISC-101'] = 'PASSED';
  assert.equal(status(course, progress), 'UNLOCKED');
  progress['ISC-102'] = 'IN_PROGRESS';
  assert.equal(status(course, progress), 'IN_PROGRESS');
});
test('PPS requiere todas las demás asignaturas aprobadas', () => {
  const progress = normalize(Object.fromEntries(curriculum.map(c => [c.code, 'PASSED'])));
  const pps = curriculum.find(c => c.code === 'PPS-100');
  assert.deepEqual(missing(pps, progress), []);
  progress['ISC-101'] = 'PENDING';
  assert.deepEqual(missing(pps, progress), ['ISC-101']);
});
test('acepta backups originales y rechaza entradas inválidas', () => {
  assert.equal(parseBackup('{"ISC-101":"PASSED"}').progress['ISC-101'], 'PASSED');
  assert.deepEqual(parseBackup('{"states":{"ISC-101":"PASSED"},"hiddenTags":["ISC-101"]}').hidden, ['ISC-101']);
  for (const input of ['null', '[]', '{}', '{"fake":"PASSED"}', '{"ISC-101":"wrong"}']) assert.throws(() => parseBackup(input));
});
