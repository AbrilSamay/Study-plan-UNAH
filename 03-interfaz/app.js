import { curriculum } from '../01-datos/curriculum.js';
import { categories, totalUV, missing, status, load, persist, parseBackup } from '../02-logica/plan.js';

// App state: datos persistentes separados de los filtros temporales de la vista.
let { progress, hidden, theme, warning } = load();
let selectedArea = 'ALL', filter = 'ALL', query = '';
const $ = selector => document.querySelector(selector);
const labels = { PENDING: 'Pendiente', PASSED: 'Aprobada', IN_PROGRESS: 'En curso', UNLOCKED: 'Disponible', LOCKED: 'Bloqueada' };
const shortAreas = ['Software y algoritmos', 'Ingeniería y gestión de TI', 'Bases y ciencia de datos', 'Redes e infraestructura', 'Matemáticas y física', 'Administración y cierre', 'Formación general'];

// Feedback: anuncia cambios y storage errors sin interrumpir la navegación.
function notify(message) { $('#notice').textContent = message; $('#notice').hidden = false; }
function save() {
  try { persist(progress, hidden); notify('Avance guardado en este navegador.'); }
  catch { notify('No se pudo guardar. Descarga un respaldo antes de cerrar la página.'); }
}
function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('#theme-btn').setAttribute('aria-pressed', String(theme === 'dark'));
  $('#theme-btn').textContent = `Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`;
}

// Render overview: el resumen siempre representa todo el plan, aunque existan filtros.
function renderOverview() {
  const passed = curriculum.filter(course => progress[course.code] === 'PASSED');
  const uv = passed.reduce((sum, course) => sum + course.ca, 0);
  const percent = Math.round(uv / totalUV * 100);
  $('#stat-progress').textContent = `${percent}%`;
  $('#progress-bar').style.width = `${percent}%`;
  $('#stat-passed').textContent = `${passed.length} / ${curriculum.length}`;
  $('#stat-ca').textContent = `${uv} / ${totalUV}`;
  $('#stat-active').textContent = curriculum.filter(course => progress[course.code] === 'IN_PROGRESS').length;
  const available = curriculum.filter(course => status(course, progress) === 'UNLOCKED' && !hidden.includes(course.code));
  $('#available-count').textContent = available.length;
  $('#available-list').replaceChildren();
  available.slice(0, 3).forEach(course => {
    const item = document.createElement('div'); item.className = 'available-item';
    const go = document.createElement('button');
    go.innerHTML = `<small>${course.code} · ${course.ca} UV</small><span>${course.name}</span>`;
    go.onclick = () => locate(course.code);
    const hide = document.createElement('button'); hide.className = 'hide'; hide.textContent = '×';
    hide.setAttribute('aria-label', `Ocultar ${course.name} de sugerencias`);
    hide.onclick = () => { hidden.push(course.code); save(); renderOverview(); };
    item.append(go, hide); $('#available-list').append(item);
  });
  if (!available.length) $('#available-list').textContent = 'No hay sugerencias visibles. Puedes restaurar las ocultas en Gestionar avance.';
}

// Navigation: mantiene una sola área activa para reducir la carga visual.
function renderNavigation() {
  $('#areas').innerHTML = ['Todas las áreas', ...shortAreas].map((name, index) => `<button data-area="${index - 1}" aria-pressed="${selectedArea === (index === 0 ? 'ALL' : categories[index - 1])}"><span>${name}</span><small>${index === 0 ? curriculum.length : curriculum.filter(c => c.category === categories[index - 1]).length}</small></button>`).join('');
  $('#areas').querySelectorAll('button').forEach(button => button.onclick = () => {
    selectedArea = button.dataset.area === '-1' ? 'ALL' : categories[Number(button.dataset.area)];
    renderNavigation(); renderCourses();
  });
}

// Course component: los detalles permanecen plegados; el control principal siempre está visible.
function courseCard(course) {
  const current = status(course, progress);
  const card = document.createElement('article'); card.className = `course ${current}`; card.id = `card-${course.code}`;
  const prerequisites = missing(course, progress);
  const unlocks = curriculum.filter(item => item.req.includes(course.code));
  card.innerHTML = `<div class="course-top"><span>${course.code} <span class="uv">/ ${course.ca} UV</span></span><span class="badge ${current}">${labels[current]}</span></div><h3>${course.name}</h3><details><summary>Requisitos y continuidad</summary><div class="course-detail"><p><b>Requiere:</b> ${course.req.includes('ALL_PREV') ? 'Todas las demás asignaturas' : course.req.join(', ') || 'Sin requisitos'}</p><p><b>Pendientes:</b> ${prerequisites.length ? course.req.includes('ALL_PREV') ? `${prerequisites.length} asignaturas` : prerequisites.join(', ') : 'Ninguno'}</p><p><b>Desbloquea:</b> ${unlocks.map(item => item.code).join(', ') || 'Final de esta ruta'}</p></div></details><label class="state-label" for="state-${course.code}">Mi avance<select id="state-${course.code}" ${current === 'LOCKED' ? 'disabled' : ''}>${['PENDING', 'IN_PROGRESS', 'PASSED'].map(value => `<option value="${value}" ${progress[course.code] === value ? 'selected' : ''}>${labels[value]}</option>`).join('')}</select></label>`;
  card.querySelector('select').onchange = event => {
    progress[course.code] = event.target.value; save(); renderOverview(); renderCourses();
    document.getElementById(`state-${course.code}`)?.focus({ preventScroll: true });
  };
  return card;
}
function renderCourses() {
  const match = curriculum.filter(course => (selectedArea === 'ALL' || course.category === selectedArea) && (filter === 'ALL' || status(course, progress) === filter) && `${course.code} ${course.name}`.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query));
  $('#results').textContent = `${match.length} asignaturas`;
  $('.filters').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', button.dataset.filter === filter));
  const container = $('#curriculum-container'); container.replaceChildren();
  categories.forEach((category, index) => {
    const courses = match.filter(course => course.category === category);
    if (!courses.length) return;
    const section = document.createElement('section'); section.className = 'area-section';
    section.innerHTML = `<div class="area-heading"><span class="area-number">0${index + 1}</span><h3>${category}</h3><span>${courses.length} clases</span></div><div class="course-grid"></div>`;
    courses.forEach(course => section.lastElementChild.append(courseCard(course)));
    container.append(section);
  });
  if (!match.length) container.innerHTML = '<div class="empty"><h3>No encontramos asignaturas.</h3><p>Prueba con otro nombre, estado o área.</p><button id="clear">Limpiar filtros</button></div>';
  $('#clear')?.addEventListener('click', resetFilters);
}
function resetFilters() {
  selectedArea = filter = 'ALL'; query = ''; $('#search').value = '';
  renderNavigation(); renderCourses();
}
function locate(code) {
  resetFilters();
  const card = document.getElementById(`card-${code}`);
  card.scrollIntoView({ block: 'center' });
  card.querySelector('summary').focus({ preventScroll: true });
}

// Event wiring: entradas del usuario fluyen hacia state, luego persistencia y render.
$('#search').oninput = event => {
  query = event.target.value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); renderCourses();
};
$('.filters').onclick = event => { const button = event.target.closest('[data-filter]'); if (button) { filter = button.dataset.filter; renderCourses(); } };
// Available route: limpia el contexto anterior y lleva el foco al resultado visible.
$('#show-available').onclick = () => {
  selectedArea = 'ALL';
  query = '';
  $('#search').value = '';
  filter = 'UNLOCKED';
  renderNavigation();
  renderCourses();
  const heading = $('#plan-title');
  heading.focus({ preventScroll: true });
  heading.scrollIntoView({ block: 'start' });
};
$('#theme-btn').onclick = () => {
  theme = theme === 'dark' ? 'light' : 'dark'; applyTheme();
  try { localStorage.setItem('theme', theme); } catch { notify('El tema no se pudo guardar en este navegador.'); }
};
$('#btn-restore-banner').onclick = () => { hidden = []; save(); renderOverview(); };
$('#btn-reset').onclick = () => {
  if (!confirm('¿Reiniciar todo tu avance y las sugerencias ocultas? Puedes descargar un respaldo antes.')) return;
  progress = Object.fromEntries(curriculum.map(course => [course.code, 'PENDING'])); hidden = []; save(); renderOverview(); renderCourses();
};
$('#btn-export').onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify({ states: progress, hiddenTags: hidden }, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'path_isc_backup.json'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$('#btn-import').onclick = () => $('#file-input').click();
$('#file-input').onchange = async event => {
  const file = event.target.files[0]; if (!file) return;
  try {
    if (file.size > 1000000) throw new Error('El respaldo supera 1 MB.');
    const imported = parseBackup(await file.text());
    if (!confirm('¿Reemplazar tu avance actual con este respaldo?')) return;
    progress = imported.progress; hidden = imported.hidden; save(); renderOverview(); renderCourses();
  } catch { notify('Respaldo no válido. Tu avance actual se conserva.'); }
  finally { event.target.value = ''; }
};
applyTheme(); renderNavigation(); renderOverview(); renderCourses();
if (warning) notify('No pudimos recuperar parte del guardado local. Puedes cargar un respaldo desde Gestionar avance.');
