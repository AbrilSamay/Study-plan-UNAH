import { curriculum } from '../01-datos/curriculum.js';
import { categories, totalUV, status, normalize, parseBackup } from '../02-logica/plan.js';
import { emptySnapshot } from '../02-logica/01-almacenamiento/estado.js';
import { createProgressService } from '../02-logica/02-nube/sincronizacion.js';
import { createCourseCard } from './01-componentes/tarjeta.js';

// View state: filtros y tema viven aparte del avance que sincroniza la cuenta.
const $ = selector => document.querySelector(selector);
let { progress, hidden } = emptySnapshot();
let area = 'ALL', filter = 'ALL', query = '', user = null, noticeTimer;
let theme = 'light';
try { theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'; } catch { /* Storage unavailable: se mantiene el tema claro. */ }
const areaNames = ['Software y algoritmos', 'Ingeniería y gestión de TI', 'Bases y ciencia de datos', 'Redes e infraestructura', 'Matemáticas y física', 'Administración y cierre', 'Formación general'];
const fold = text => text.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function notify(message) {
  clearTimeout(noticeTimer); $('#notice').textContent = message; $('#notice').hidden = false;
  noticeTimer = setTimeout(() => { $('#notice').hidden = true; }, 6500);
}

// Cloud bridge: UI recibe snapshots y estados; nunca anuncia sync antes del ACK del servidor.
const service = createProgressService({
  storage: localStorage,
  onSnapshot(snapshot) { progress = snapshot.progress; hidden = snapshot.hidden; renderOverview(); renderCourses(); },
  onStatus({ state, message }) {
    $('.sync-strip').dataset.state = state; $('#sync-status').textContent = message;
    $('#sync-action').textContent = user ? ['error','offline','pending'].includes(state) ? 'Reintentar →' : 'Cuenta' : 'Sincronizar';
  },
  onAccount(account) {
    user = account;
    $('#account-btn').textContent = 'Cuenta';
    $('#auth-form').hidden = Boolean(user) || !service.isConfigured();
    $('#signed-in').hidden = !user;
    $('#account-email').textContent = user?.email || '';
  }
});
function commit(next) {
  try { service.commit(next); return true; }
  catch { notify('No pudimos guardar el cambio. Descarga un respaldo y revisa el espacio del navegador.'); return false; }
}

// Theme preference: solo cambia apariencia, no provoca escrituras innecesarias a la nube.
function applyTheme() {
  document.documentElement.dataset.theme = theme;
  $('#theme-btn').textContent = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  $('#theme-btn').setAttribute('aria-pressed', String(theme === 'dark'));
}

// Global overview: métricas del plan completo aunque el usuario haya filtrado el catálogo.
function renderOverview() {
  const passed = curriculum.filter(course => progress[course.code] === 'PASSED');
  const earned = passed.reduce((sum, course) => sum + course.ca, 0);
  const percent = Math.round(earned / totalUV * 100);
  $('#stat-progress').textContent = `${percent}%`;
  $('#progress-bar').style.width = `${percent}%`;
  $('.progress-track').setAttribute('aria-valuenow', String(percent));
  $('#stat-passed').innerHTML = `${passed.length} <small>/ ${curriculum.length}</small>`;
  $('#stat-ca').innerHTML = `${earned} <small>/ ${totalUV}</small>`;
  $('#stat-active').textContent = curriculum.filter(course => progress[course.code] === 'IN_PROGRESS').length;
  const available = curriculum.filter(course => status(course, progress) === 'UNLOCKED' && !hidden.includes(course.code));
  $('#available-count').textContent = available.length;
  const list = $('#available-list'); list.replaceChildren();
  available.slice(0,3).forEach(course => {
    const item = document.createElement('div'); item.className = 'available-item';
    const go = document.createElement('button'); go.type = 'button';
    const name = document.createElement('span'); name.textContent = course.name;
    const meta = document.createElement('small'); meta.textContent = `${course.code} · ${course.ca} UV`;
    go.append(name, meta); go.onclick = () => locate(course.code);
    const hideButton = document.createElement('button'); hideButton.type = 'button'; hideButton.className = 'hide'; hideButton.textContent = '×';
    hideButton.setAttribute('aria-label', `Ocultar ${course.name} de sugerencias`);
    hideButton.onclick = () => commit({ progress, hidden: [...hidden, course.code] });
    item.append(go, hideButton); list.append(item);
  });
  if (!available.length) list.innerHTML = '<p class="no-suggestions">No hay sugerencias visibles. Puedes restaurar las ocultas en Gestionar.</p>';
}

function renderNavigation() {
  $('#areas').innerHTML = ['Todas las áreas', ...areaNames].map((name,index) => {
    const category = index === 0 ? 'ALL' : categories[index-1];
    return `<button type="button" data-area="${index-1}" aria-pressed="${area === category}"><span>${name}</span><small>${index === 0 ? curriculum.length : curriculum.filter(course => course.category === category).length}</small></button>`;
  }).join('');
}
function renderCourses() {
  const matches = curriculum.filter(course => (area === 'ALL' || area === course.category) && (filter === 'ALL' || status(course,progress) === filter) && fold(`${course.code} ${course.name}`).includes(query));
  $('#results').textContent = `${matches.length} asignaturas`;
  $('.filters').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  const container = $('#curriculum-container');
  // Preserve context: conserva el foco y los detalles abiertos cuando llega un cambio remoto.
  const focusId = container.contains(document.activeElement) ? document.activeElement.id : null;
  const opened = new Set([...container.querySelectorAll('article details[open]')].map(el => el.closest('article').id));
  container.replaceChildren();
  categories.forEach((category,index) => {
    const courses = matches.filter(course => course.category === category); if (!courses.length) return;
    const section = document.createElement('section'); section.className = 'area-section';
    const passed = curriculum.filter(course => course.category === category && progress[course.code] === 'PASSED').length;
    section.innerHTML = `<div class="area-heading"><span class="area-number">${String(index+1).padStart(2,'0')}</span><h3>${category}</h3><span>${courses.length} clases</span></div><div class="course-grid"></div>`;
    for (const course of courses) {
      const card = createCourseCard(course, progress, changeState);
      if (opened.has(card.id)) card.querySelector('details').open = true;
      section.lastElementChild.append(card);
    }
    container.append(section);
  });
  if (!matches.length) {
    container.innerHTML = '<div class="empty"><span aria-hidden="true">⌕</span><h3>No encontramos asignaturas.</h3><p>Prueba con otro nombre, estado o área.</p><button class="secondary-button" id="clear">Limpiar filtros</button></div>';
    $('#clear').onclick = resetFilters;
  }
  if (focusId) document.getElementById(focusId)?.focus({ preventScroll:true });
}
function changeState(code,value) {
  commit({ progress: { ...progress, [code]:value }, hidden });
  document.getElementById(`state-${code}`)?.focus({ preventScroll:true });
}
function resetFilters() { area = filter = 'ALL'; query = ''; $('#search').value = ''; renderNavigation(); renderCourses(); }
function locate(code) {
  resetFilters(); const card = document.getElementById(`card-${code}`); if (!card) return;
  card.scrollIntoView({ block:'center' }); card.querySelector('summary').focus({ preventScroll:true });
}

// Navigation events: mobile cierra áreas al elegir y deja el contenido visible.
$('#areas').onclick = event => {
  const button = event.target.closest('[data-area]'); if (!button) return;
  area = button.dataset.area === '-1' ? 'ALL' : categories[Number(button.dataset.area)];
  renderNavigation(); renderCourses();
  if (matchMedia('(max-width:800px)').matches) { closeSidebar(false); $('#plan-title').focus({preventScroll:true}); $('#plan-title').scrollIntoView({block:'start'}); }
};
$('#search').oninput = event => { query = fold(event.target.value.trim()); renderCourses(); };
$('.filters').onclick = event => { const button = event.target.closest('[data-filter]'); if (button) { filter = button.dataset.filter; renderCourses(); } };
$('#show-available').onclick = () => { resetFilters(); filter = 'UNLOCKED'; renderCourses(); $('#plan-title').focus({preventScroll:true}); $('#plan-title').scrollIntoView({block:'start'}); };
$('#theme-btn').onclick = () => { theme = theme === 'dark' ? 'light':'dark'; applyTheme(); try { localStorage.setItem('theme',theme); } catch { notify('No se pudo recordar el tema.'); } };

// Backup tools: siguen disponibles sin conexión y conservan el formato original.
$('#btn-restore-banner').onclick = () => { commit({progress,hidden:[]}); };
$('#btn-reset').onclick = () => {
  if (confirm(user ? '¿Reiniciar tu avance? Este cambio se sincronizará en tus dispositivos.' : '¿Reiniciar el avance de este dispositivo? Descarga un respaldo antes si lo necesitas.')) commit(emptySnapshot());
};
$('#btn-export').onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify({states:progress,hiddenTags:hidden},null,2)],{type:'application/json'}));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'path_isc_backup.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
};
$('#btn-import').onclick = () => $('#file-input').click();
$('#file-input').onchange = async event => {
  const file = event.target.files[0]; if (!file) return;
  try {
    if (file.size > 1000000) throw new Error();
    const imported = parseBackup(await file.text());
    if (confirm(user ? '¿Reemplazar tu avance con este respaldo y sincronizarlo en tus dispositivos?' : '¿Reemplazar el avance de este dispositivo con el respaldo?')) commit(imported);
  } catch { notify('Respaldo no válido. Conservamos tu avance actual.'); }
  finally { event.target.value = ''; }
};

// Account flow: no copia el avance de invitado sobre una cuenta sin elección explícita.
function openAccount() {
  $('#cloud-unavailable').hidden = service.isConfigured();
  $('#auth-form').hidden = Boolean(user) || !service.isConfigured();
  if (!$('#account-dialog').open) $('#account-dialog').showModal();
}
$('#account-btn').onclick = openAccount;
$('#close-account').onclick = () => $('#account-dialog').close();
$('#sync-action').onclick = () => { if (user && ['error','offline','pending'].includes($('.sync-strip').dataset.state)) void service.sync(); else openAccount(); };
async function authenticate(register = false) {
  const form = $('#auth-form'); if (!form.reportValidity()) return;
  const email = $('#auth-email').value.trim(), password = $('#auth-password').value;
  const buttons = [$('#login-btn'),$('#register-btn')]; buttons.forEach(button => button.disabled = true);
  $('#auth-message').textContent = register ? 'Creando tu cuenta…' : 'Iniciando sesión…';
  try {
    if (register) {
      const signedIn = await service.register(email,password);
      $('#auth-message').textContent = signedIn ? 'Cuenta creada. Tu avance ya puede sincronizarse.' : 'Revisa tu correo y confirma tu cuenta. Después podrás iniciar sesión.';
    } else { await service.login(email,password); $('#auth-message').textContent = 'Sesión iniciada. Estamos recuperando tu avance.'; }
    $('#auth-password').value = '';
  } catch (error) { $('#auth-message').textContent = error.message; }
  finally { buttons.forEach(button => button.disabled = false); }
}
$('#auth-form').onsubmit = event => { event.preventDefault(); void authenticate(); };
$('#register-btn').onclick = () => { void authenticate(true); };
$('#retry-sync').onclick = () => { void service.sync(); };
$('#adopt-local').onclick = () => {
  if (!service.isReady()) { $('#auth-message').textContent = 'Primero conecta y recupera tu cuenta para evitar reemplazar datos sin comprobarlos.'; return; }
  const guest = service.guestSnapshot();
  if (confirm('¿Usar el avance anterior de este dispositivo en tu cuenta? Reemplazará los estados actuales y se sincronizará.')) commit(guest);
};
$('#logout-btn').onclick = async () => {
  if (service.hasPending() && !confirm('Hay cambios pendientes. Quedarán guardados para esta cuenta en este navegador. ¿Cerrar sesión?')) return;
  try { await service.logout(); $('#auth-message').textContent = 'Sesión cerrada. El avance de tu cuenta sigue separado del avance local.'; }
  catch (error) { $('#auth-message').textContent = error.message; }
};

// Sidebar controller: el contenido oculto no queda accesible por teclado.
const mobileMenu = matchMedia('(max-width:800px)');
let desktopHidden = false;
try { desktopHidden = localStorage.getItem('sidebar-hidden') === 'true'; } catch { /* Preference optional. */ }
function updateSidebar(open) {
  const mobile = mobileMenu.matches;
  document.body.classList.toggle('menu-open', mobile && open);
  document.body.classList.toggle('sidebar-hidden', !mobile && !open);
  $('#menu-toggle').setAttribute('aria-expanded',String(open));
  $('#sidebar').inert = !open;
  $('#menu-backdrop').hidden = !mobile || !open;
  // Mobile modal: bloquea la página detrás del drawer mientras está abierto.
  $('#contenido').inert = mobile && open;
  if (mobile && open) {
    $('#sidebar').setAttribute('role','dialog');
    $('#sidebar').setAttribute('aria-modal','true');
  } else {
    $('#sidebar').removeAttribute('role');
    $('#sidebar').removeAttribute('aria-modal');
  }
}
function closeSidebar(restoreFocus = true) {
  if (!mobileMenu.matches) {
    desktopHidden = true;
    try { localStorage.setItem('sidebar-hidden','true'); } catch { /* Preference optional. */ }
  }
  updateSidebar(false);
  if (restoreFocus) $('#menu-toggle').focus();
}
$('#menu-toggle').onclick = () => {
  const open = $('#menu-toggle').getAttribute('aria-expanded') !== 'true';
  if (!mobileMenu.matches) {
    desktopHidden = !open;
    try { localStorage.setItem('sidebar-hidden',String(desktopHidden)); } catch { /* Preference optional. */ }
  }
  updateSidebar(open);
  if (open && mobileMenu.matches) $('#close-sidebar').focus();
};
$('#close-sidebar').onclick = () => closeSidebar();
$('#menu-backdrop').onclick = () => closeSidebar();
document.addEventListener('keydown',event => {
  if (!mobileMenu.matches || !document.body.classList.contains('menu-open')) return;
  if (event.key === 'Escape') { event.preventDefault(); closeSidebar(); }
  if (event.key === 'Tab') {
    const controls = [...$('#sidebar').querySelectorAll('button,a[href]')].filter(el => !el.disabled);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
mobileMenu.addEventListener('change',() => updateSidebar(mobileMenu.matches ? false : !desktopHidden));
updateSidebar(mobileMenu.matches ? false : !desktopHidden);
applyTheme(); renderNavigation();
void service.start();
