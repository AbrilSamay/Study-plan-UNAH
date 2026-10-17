import { curriculum } from '../../01-datos/curriculum.js';
import { normalize, validHidden } from '../plan.js';

export const emptySnapshot = () => ({ progress: normalize({}), hidden: [] });
const known = new Set(curriculum.map(course => course.code));
const validStates = new Set(['PENDING', 'IN_PROGRESS', 'PASSED']);

// Scoped cache: cada cuenta tiene su propia copia y cola; nunca mezcla usuarios.
export function readCache(storage, userId = 'guest') {
  const key = `ruta_v2:${userId}`;
  try {
    const saved = JSON.parse(storage.getItem(key) || 'null');
    if (saved) {
      const queue = Object.fromEntries(Object.entries(saved.queue || {}).filter(([code, patch]) =>
        known.has(code) && patch && typeof patch === 'object' &&
        (patch.state === undefined || validStates.has(patch.state)) &&
        (patch.hidden === undefined || typeof patch.hidden === 'boolean')
      ));
      return { progress: normalize(saved.progress), hidden: validHidden(saved.hidden), queue };
    }
    if (userId === 'guest') {
      return {
        progress: normalize(JSON.parse(storage.getItem('isc_user_states_v5') || '{}')),
        hidden: validHidden(JSON.parse(storage.getItem('isc_hidden_banner_tags') || '[]')),
        queue: {}
      };
    }
  } catch { /* Invalid cache: el original queda intacto y puede recuperarse con backup. */ }
  return { ...emptySnapshot(), queue: {} };
}

// Overlay queue: los cambios offline locales siempre se muestran sobre la copia remota.
export function overlay(snapshot, queue) {
  const result = { progress: { ...snapshot.progress }, hidden: [...snapshot.hidden] };
  for (const [code, patch] of Object.entries(queue)) {
    if (!known.has(code)) continue;
    if (validStates.has(patch.state)) result.progress[code] = patch.state;
    if (patch.hidden !== undefined) {
      result.hidden = result.hidden.filter(item => item !== code);
      if (patch.hidden) result.hidden.push(code);
    }
  }
  return result;
}

// Remote decoder: el servidor devuelve una fila por asignatura, no un snapshot que pisa todo.
export function fromRows(rows) {
  const snapshot = emptySnapshot();
  for (const row of rows) {
    if (!known.has(row.course_code)) continue;
    if (validStates.has(row.state)) snapshot.progress[row.course_code] = row.state;
    if (row.hidden) snapshot.hidden.push(row.course_code);
  }
  return snapshot;
}

// Patch diff: envia únicamente los campos que realmente cambió el usuario.
export function difference(previous, next) {
  const oldHidden = new Set(previous.hidden), newHidden = new Set(next.hidden);
  const patches = {};
  for (const course of curriculum) {
    const code = course.code, patch = {};
    if (previous.progress[code] !== next.progress[code]) patch.state = next.progress[code];
    if (oldHidden.has(code) !== newHidden.has(code)) patch.hidden = newHidden.has(code);
    if (Object.keys(patch).length) patches[code] = patch;
  }
  return patches;
}

// Acknowledge safely: no borra una edición nueva mientras otra petición estaba en vuelo.
export function acknowledge(queue, sent) {
  const remaining = structuredClone(queue);
  for (const [code, patch] of Object.entries(sent)) {
    for (const [field, value] of Object.entries(patch)) {
      if (remaining[code]?.[field] === value) delete remaining[code][field];
    }
    if (remaining[code] && !Object.keys(remaining[code]).length) delete remaining[code];
  }
  return remaining;
}
