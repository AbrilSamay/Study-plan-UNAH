import { cloud } from './cliente.js';
import { readCache, difference, overlay, fromRows, acknowledge } from '../01-almacenamiento/estado.js';

// Sync service: cuenta, cache local, cola de cambios y recepción desde otro dispositivo.
export function createProgressService({ storage, onSnapshot, onStatus, onAccount }) {
  let user = null, cache = readCache(storage), epoch = 0;
  let channel = null, running = false, rerun = false, ready = false;
  let stopped = false, interval = null, authSubscription = null;
  let guestSnapshot = { progress: cache.progress, hidden: cache.hidden };

  const report = (state, message) => onStatus({ state, message, pending: Object.keys(cache.queue).length });
  const pending = () => Object.keys(cache.queue).length > 0;
  const snapshot = () => ({ progress: cache.progress, hidden: cache.hidden });
  function persist() { storage.setItem(`ruta_v2:${user?.id || 'guest'}`, JSON.stringify(cache)); }
  function emit() { onSnapshot(snapshot()); }

  // Local first: escribe antes de prometer guardado y actualiza solo el diff del usuario.
  function commit(next) {
    const patches = difference(snapshot(), next);
    const previous = cache;
    cache = { ...next, queue: structuredClone(cache.queue) };
    if (user) for (const [code, patch] of Object.entries(patches)) cache.queue[code] = { ...cache.queue[code], ...patch };
    try { persist(); } catch (error) { cache = previous; throw error; }
    emit();
    if (user) {
      report('pending', 'Cambios guardados aquí · sincronizando');
      void sync();
    } else report('local', 'Guardado en este dispositivo');
  }

  async function sync() {
    if (!cloud || !user || stopped) return;
    if (running) { rerun = true; return; }
    if (!navigator.onLine) { report('offline', 'Sin conexión · cambios pendientes'); return; }
    running = true;
    const requestEpoch = epoch, requestUser = user.id;
    try {
      report('pending', pending() ? 'Sincronizando cambios…' : 'Comprobando tu avance…');
      // First read: nunca publica el cache antes de comprobar la cuenta remota.
      let response = await cloud.from('course_progress').select('course_code,state,hidden').eq('user_id', requestUser);
      if (response.error) throw response.error;
      if (epoch !== requestEpoch) return;
      ready = true;
      let remote = fromRows(response.data);
      let visible = overlay(remote, cache.queue);
      cache = { ...visible, queue: cache.queue };
      persist(); emit();

      const sent = structuredClone(cache.queue);
      if (Object.keys(sent).length) {
        const { error } = await cloud.rpc('apply_progress_changes', { changes: sent });
        if (error) throw error;
        if (epoch !== requestEpoch) return;
        cache.queue = acknowledge(cache.queue, sent);
        // Persist ack: evita reenviar cambios ya confirmados después de recargar.
        persist();
        response = await cloud.from('course_progress').select('course_code,state,hidden').eq('user_id', requestUser);
        if (response.error) throw response.error;
        if (epoch !== requestEpoch) return;
        remote = fromRows(response.data);
        visible = overlay(remote, cache.queue);
        cache = { ...visible, queue: cache.queue };
        persist(); emit();
      }
      report(pending() ? 'pending' : 'synced', pending() ? 'Quedan cambios por sincronizar' : 'Sincronizado entre dispositivos');
    } catch {
      if (epoch === requestEpoch) report('error', 'No se pudo sincronizar · reintentar');
    } finally {
      running = false;
      if (rerun) { rerun = false; void sync(); }
    }
  }

  // Auth transition: invalida peticiones anteriores y aísla el cache de cada cuenta.
  async function setAccount(nextUser) {
    if (user?.id === nextUser?.id) return;
    epoch += 1; ready = false;
    if (!user) guestSnapshot = structuredClone(snapshot());
    if (channel) { void cloud.removeChannel(channel); channel = null; }
    user = nextUser;
    cache = readCache(storage, user?.id || 'guest');
    onAccount(user); emit();
    if (!user) { report('local', 'Solo en este dispositivo'); return; }
    const accountId = user.id;
    channel = cloud.channel(`progress:${accountId}`).on('postgres_changes', {
      event: '*', schema: 'public', table: 'course_progress', filter: `user_id=eq.${accountId}`
    }, () => { if (user?.id === accountId) void sync(); }).subscribe();
    await sync();
  }

  // Lifecycle: Realtime recibe cambios; polling visible cubre reconexiones y suspensión móvil.
  function refresh() { if (document.visibilityState !== 'hidden') void sync(); }
  async function start() {
    emit(); onAccount(null);
    if (!cloud) { report('setup', 'Guardado local · nube por conectar'); return; }
    authSubscription = cloud.auth.onAuthStateChange((_event, session) => {
      // Outside auth callback: evita bloquear el lock interno del SDK con consultas.
      setTimeout(() => { if (!stopped) void setAccount(session?.user || null); }, 0);
    }).data.subscription;
    const { data, error } = await cloud.auth.getSession();
    if (error) report('error', 'No se pudo recuperar la sesión');
    else await setAccount(data.session?.user || null);
    if (!data.session) report('local', 'Inicia sesión para sincronizar');
    interval = setInterval(refresh, 15000);
    window.addEventListener('online', refresh);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
  }

  return {
    start, commit, sync,
    isConfigured: () => Boolean(cloud),
    isReady: () => ready,
    hasPending: pending,
    guestSnapshot: () => structuredClone(guestSnapshot),
    async login(email, password) {
      if (!cloud) throw new Error('La nube aún no está conectada.');
      const { error } = await cloud.auth.signInWithPassword({ email, password });
      if (error) throw new Error('No pudimos iniciar sesión. Revisa el correo, la contraseña y la confirmación del correo.');
    },
    async register(email, password) {
      if (!cloud) throw new Error('La nube aún no está conectada.');
      const { data, error } = await cloud.auth.signUp({ email, password, options: { emailRedirectTo: new URL('./', location.href).href } });
      if (error) throw new Error('No se pudo crear la cuenta. Revisa la configuración de correo o inténtalo más tarde.');
      return Boolean(data.session);
    },
    async logout() {
      if (!cloud) return;
      const { error } = await cloud.auth.signOut({ scope: 'local' });
      if (error) throw new Error('No se pudo cerrar la sesión. Inténtalo de nuevo.');
    },
    stop() {
      stopped = true; epoch += 1; clearInterval(interval); authSubscription?.unsubscribe();
      if (channel) void cloud.removeChannel(channel);
      window.removeEventListener('online', refresh); window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    }
  };
}
