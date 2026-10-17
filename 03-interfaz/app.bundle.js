// Generated entry: compatible con servidor y apertura directa del HTML.
(() => {
// Source section: 01-datos/curriculum.js
// Source data: plan recibido en el ZIP; no representa validación oficial de la UNAH.
const curriculum = [
        // Data group: PROGRAMACIÓN Y SOFTWARE; agrupa las asignaturas de esta área.
        { code: "ISC-101", name: "Introducción a la Ingeniería en Sistemas Computacionales", ca: 4, req: [], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-102", name: "Programación Estructurada", ca: 4, req: ["ISC-101"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-103", name: "Programación Orientada a Objetos", ca: 5, req: ["ISC-102"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-204", name: "Paradigmas de Programación", ca: 4, req: ["ISC-103"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-211", name: "Estructuras de Datos", ca: 4, req: ["MM-420", "MM-211"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-312", name: "Teoría de la Computación", ca: 4, req: ["ISC-211", "ISC-204"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-313", name: "Compiladores", ca: 4, req: ["ISC-312"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-305", name: "Programación Web", ca: 4, req: ["ISC-321"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-407", name: "Programación Móvil", ca: 5, req: ["ISC-305"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-414", name: "Inteligencia Artificial", ca: 4, req: ["ISC-313", "MM-401"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-415", name: "Tecnologías Emergentes", ca: 4, req: ["ISC-305", "ISC-437", "ISC-332"], category: "Desarrollo de Software y Algoritmos" },

        // Data group: INGENIERÍA DE SOFTWARE Y PROYECTOS; agrupa las asignaturas de esta área.
        { code: "ISC-341", name: "Sistemas de Información", ca: 4, req: ["ISC-351"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-306", name: "Análisis de Requerimientos", ca: 4, req: ["ISC-341"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-408", name: "Ingeniería del Software", ca: 4, req: ["ISC-306"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-409", name: "Calidad de Software", ca: 4, req: ["ISC-408"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-443", name: "Industria de TI", ca: 4, req: ["ISC-306"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-445", name: "Proyectos de TI", ca: 4, req: ["ISC-443", "ISC-442"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-546", name: "Ejecución de Proyectos de TI", ca: 4, req: ["ISC-445"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-544", name: "Auditoría Informática", ca: 4, req: ["ISC-442", "ISC-306"], category: "Ingeniería de Software y Gestión de TI" },

        // Data group: DATOS E INFORMACIÓN; agrupa las asignaturas de esta área.
        { code: "ISC-321", name: "Fundamentos de Base de Datos", ca: 5, req: ["MM-420"], category: "Bases de Datos y Ciencia de Datos" },
        { code: "ISC-422", name: "Administración de Base de Datos", ca: 4, req: ["ISC-321"], category: "Bases de Datos y Ciencia de Datos" },
        { code: "ISC-423", name: "Ciencia de Datos", ca: 4, req: ["ISC-422"], category: "Bases de Datos y Ciencia de Datos" },

        // Data group: REDES, HARDWARE Y SEGURIDAD; agrupa las asignaturas de esta área.
        { code: "IE-326", name: "Instalaciones Eléctricas para Centros de Datos", ca: 4, req: ["FS-200"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-331", name: "Redes de Datos I", ca: 4, req: ["IE-326"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-332", name: "Redes de Datos II", ca: 4, req: ["ISC-331"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-333", name: "Sistemas Operativos I", ca: 4, req: ["ISC-211"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-334", name: "Sistemas Operativos II", ca: 4, req: ["ISC-333"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-336", name: "Diseño Digital", ca: 4, req: ["ISC-321", "ISC-334"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-437", name: "Arquitectura de Computadoras", ca: 4, req: ["ISC-336"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-435", name: "Administración de Servidores", ca: 4, req: ["ISC-334", "ISC-332"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-442", name: "Seguridad Informática", ca: 4, req: ["ISC-435"], category: "Redes, Sistemas e Infraestructura" },

        // Data group: CIENCIAS BÁSICAS Y MATEMÁTICAS; agrupa las asignaturas de esta área.
        { code: "MM-110", name: "Matemática I", ca: 5, req: [], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-111", name: "Geometría y Trigonometría", ca: 5, req: [], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-201", name: "Cálculo I", ca: 5, req: ["MM-110", "MM-111"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-211", name: "Vectores y Matrices", ca: 3, req: ["MM-110", "MM-111"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-420", name: "Matemática Discreta", ca: 4, req: ["MM-110"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-202", name: "Cálculo II", ca: 5, req: ["MM-201", "MM-211"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-401", name: "Estadística I", ca: 3, req: ["MM-202"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "FS-100", name: "Física I", ca: 5, req: ["MM-201", "MM-211"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "FS-200", name: "Física II", ca: 5, req: ["FS-100", "MM-202"], category: "Matemáticas y Ciencias Fisicomatemáticas" },

        // Data group: GESTIÓN Y COMPLEMENTARIAS; agrupa las asignaturas de esta área.
        { code: "AGE-102", name: "Administración", ca: 4, req: ["ISC-103", "MM-401"], category: "Administración, Investigación y Cierre" },
        { code: "ISC-351", name: "Contabilidad Financiera", ca: 4, req: ["AGE-102"], category: "Administración, Investigación y Cierre" },
        { code: "ISC-552", name: "Seminario de Investigación", ca: 4, req: ["ISC-415", "ISC-445", "ISC-423"], category: "Administración, Investigación y Cierre" },
        { code: "PPS-100", name: "Práctica Profesional Supervisada", ca: 0, req: ["ALL_PREV"], category: "Administración, Investigación y Cierre" },

        // Data group: GENERALES Y OPTATIVAS; agrupa las asignaturas de esta área.
        { code: "EG-011", name: "Español General", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "SC-101", name: "Sociología", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "FF-101", name: "Filosofía", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "HH-101", name: "Historia de Honduras", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "IN-101", name: "Optativa I: Lenguas Extranjeras (Inglés I)", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "IN-102", name: "Inglés II", ca: 4, req: ["IN-101"], category: "Formación General y Optativas" },
        { code: "IN-103", name: "Inglés III", ca: 4, req: ["IN-102"], category: "Formación General y Optativas" },
        { code: "HUM-OPT", name: "Optativa II: Campo de las Humanidades", ca: 3, req: [], category: "Formación General y Optativas" },
        { code: "ART-OPT", name: "Optativa III: Campo de las Artes y del Deporte", ca: 3, req: [], category: "Formación General y Optativas" },
        { code: "NAT-OPT", name: "Optativa IV: Campo de las Ciencias Naturales", ca: 3, req: [], category: "Formación General y Optativas" }
    ];

// Source section: 02-logica/plan.js

// State contract: solo estos valores pueden entrar al avance, desde UI o backup.
const states = ['PENDING', 'IN_PROGRESS', 'PASSED'];
const categories = [...new Set(curriculum.map(course => course.category))];
const totalUV = curriculum.reduce((sum, course) => sum + course.ca, 0);

// Normalize input: descarta códigos desconocidos y completa las clases pendientes.
function normalize(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('El avance debe ser un objeto.');
  return Object.fromEntries(curriculum.map(course => [course.code, states.includes(input[course.code]) ? input[course.code] : 'PENDING']));
}

// Requirement engine: PPS requiere aprobar todas las otras materias del plan.
function missing(course, progress) {
  const requirements = course.req.includes('ALL_PREV')
    ? curriculum.filter(item => item.code !== course.code).map(item => item.code)
    : course.req;
  return requirements.filter(code => progress[code] !== 'PASSED');
}
function status(course, progress) {
  return progress[course.code] !== 'PENDING' ? progress[course.code] : missing(course, progress).length ? 'LOCKED' : 'UNLOCKED';
}

// Storage boundary: conserva las keys originales para recuperar avances anteriores.
function load() {
  let progress = normalize({}), hidden = [], theme = 'light', warning = false;
  try {
    progress = normalize(JSON.parse(localStorage.getItem('isc_user_states_v5') || '{}'));
    const stored = JSON.parse(localStorage.getItem('isc_hidden_banner_tags') || '[]');
    hidden = validHidden(stored);
    theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  } catch { warning = true; }
  return { progress, hidden, theme, warning };
}
function validHidden(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(code => curriculum.some(course => course.code === code)))];
}
function persist(progress, hidden) {
  localStorage.setItem('isc_user_states_v5', JSON.stringify(progress));
  localStorage.setItem('isc_hidden_banner_tags', JSON.stringify(hidden));
}

// Backup validation: valida todo antes de reemplazar el avance existente.
function parseBackup(text) {
  const input = JSON.parse(text);
  const source = input?.states ?? input;
  if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('Formato no válido.');
  const entries = Object.entries(source);
  if (!entries.length || entries.some(([code, value]) => !curriculum.some(course => course.code === code) || !states.includes(value))) throw new Error('El archivo contiene códigos o estados no válidos.');
  if (input.states && input.hiddenTags !== undefined && !Array.isArray(input.hiddenTags)) throw new Error('Las clases ocultas deben ser una lista.');
  return { progress: normalize(source), hidden: validHidden(input.hiddenTags || []) };
}

// Source section: 03-interfaz/app.js

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

})();
