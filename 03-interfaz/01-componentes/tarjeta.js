import { curriculum } from '../../01-datos/curriculum.js';
import { missing, status } from '../../02-logica/plan.js';

export const labels = { PENDING: 'Pendiente', PASSED: 'Aprobada', IN_PROGRESS: 'En curso', UNLOCKED: 'Disponible', LOCKED: 'Bloqueada' };

// Course component: título antes de metadata en DOM y pantalla; el lector sigue el mismo orden.
export function createCourseCard(course, progress, onChange) {
  const current = status(course, progress);
  const prerequisites = missing(course, progress);
  const unlocks = curriculum.filter(item => item.req.includes(course.code));
  const card = document.createElement('article');
  card.className = `course ${current}`;
  card.id = `card-${course.code}`;
  const requiredText = course.req.includes('ALL_PREV') ? 'Todas las demás asignaturas' : course.req.join(', ') || 'Sin requisitos';
  const pendingText = prerequisites.length ? course.req.includes('ALL_PREV') ? `${prerequisites.length} asignaturas` : prerequisites.join(', ') : 'Ninguno';
  card.innerHTML = `
    <h3 class="course-name">${course.name}</h3>
    <div class="course-top"><span class="course-code">${course.code} <span class="uv">· ${course.ca} UV</span></span><span class="badge ${current}"><span aria-hidden="true" class="badge-dot"></span>${labels[current]}</span></div>
    <details><summary>Requisitos y continuidad <span aria-hidden="true">+</span></summary><div class="course-detail"><p><b>Requiere:</b> ${requiredText}</p><p><b>Pendientes:</b> ${pendingText}</p><p><b>Desbloquea:</b> ${unlocks.map(item => item.code).join(', ') || 'Final de esta ruta'}</p></div></details>
    <label class="state-label" for="state-${course.code}">Mi avance<select id="state-${course.code}" ${current === 'LOCKED' ? 'disabled' : ''}>${['PENDING', 'IN_PROGRESS', 'PASSED'].map(value => `<option value="${value}" ${progress[course.code] === value ? 'selected' : ''}>${labels[value]}</option>`).join('')}</select></label>`;
  card.querySelector('select').onchange = event => onChange(course.code, event.target.value);
  return card;
}
