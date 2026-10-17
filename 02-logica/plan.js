import { curriculum } from '../01-datos/curriculum.js';

// State contract: solo estos valores pueden entrar al avance, desde UI o backup.
export const states = ['PENDING', 'IN_PROGRESS', 'PASSED'];
export const categories = [...new Set(curriculum.map(course => course.category))];
export const totalUV = curriculum.reduce((sum, course) => sum + course.ca, 0);

// Normalize input: descarta códigos desconocidos y completa las clases pendientes.
export function normalize(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('El avance debe ser un objeto.');
  return Object.fromEntries(curriculum.map(course => [course.code, states.includes(input[course.code]) ? input[course.code] : 'PENDING']));
}

// Requirement engine: PPS requiere aprobar todas las otras materias del plan.
export function missing(course, progress) {
  const requirements = course.req.includes('ALL_PREV')
    ? curriculum.filter(item => item.code !== course.code).map(item => item.code)
    : course.req;
  return requirements.filter(code => progress[code] !== 'PASSED');
}
export function status(course, progress) {
  return progress[course.code] !== 'PENDING' ? progress[course.code] : missing(course, progress).length ? 'LOCKED' : 'UNLOCKED';
}

// Storage boundary: conserva las keys originales para recuperar avances anteriores.
export function load() {
  let progress = normalize({}), hidden = [], theme = 'light', warning = false;
  try {
    progress = normalize(JSON.parse(localStorage.getItem('isc_user_states_v5') || '{}'));
    const stored = JSON.parse(localStorage.getItem('isc_hidden_banner_tags') || '[]');
    hidden = validHidden(stored);
    theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  } catch { warning = true; }
  return { progress, hidden, theme, warning };
}
export function validHidden(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(code => curriculum.some(course => course.code === code)))];
}
export function persist(progress, hidden) {
  localStorage.setItem('isc_user_states_v5', JSON.stringify(progress));
  localStorage.setItem('isc_hidden_banner_tags', JSON.stringify(hidden));
}

// Backup validation: valida todo antes de reemplazar el avance existente.
export function parseBackup(text) {
  const input = JSON.parse(text);
  const source = input?.states ?? input;
  if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('Formato no válido.');
  const entries = Object.entries(source);
  if (!entries.length || entries.some(([code, value]) => !curriculum.some(course => course.code === code) || !states.includes(value))) throw new Error('El archivo contiene códigos o estados no válidos.');
  if (input.states && input.hiddenTags !== undefined && !Array.isArray(input.hiddenTags)) throw new Error('Las clases ocultas deben ser una lista.');
  return { progress: normalize(source), hidden: validHidden(input.hiddenTags || []) };
}
