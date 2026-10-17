import test from 'node:test';
import assert from 'node:assert/strict';
import { emptySnapshot, overlay, difference, acknowledge, fromRows, readCache } from '../02-logica/01-almacenamiento/estado.js';

// Conflict regression: editar dos clases en equipos distintos no pisa el snapshot completo.
test('patches preservan una asignatura modificada en otro dispositivo', () => {
  const previous = emptySnapshot();
  const local = structuredClone(previous); local.progress['ISC-101'] = 'PASSED';
  const queue = difference(previous,local);
  const remote = fromRows([{course_code:'MM-110',state:'PASSED',hidden:false}]);
  const combined = overlay(remote,queue);
  assert.equal(combined.progress['ISC-101'],'PASSED');
  assert.equal(combined.progress['MM-110'],'PASSED');
  assert.deepEqual(Object.keys(queue),['ISC-101']);
});
test('ocultar una sugerencia no reemplaza un estado remoto más reciente', () => {
  const base = emptySnapshot(); const next = structuredClone(base); next.hidden = ['ISC-101'];
  const remote = fromRows([{course_code:'ISC-101',state:'PASSED',hidden:false}]);
  assert.deepEqual(difference(base,next),{'ISC-101':{hidden:true}});
  assert.equal(overlay(remote,difference(base,next)).progress['ISC-101'],'PASSED');
});
test('el ACK conserva ediciones nuevas realizadas durante una petición', () => {
  const sent = {'ISC-101':{state:'IN_PROGRESS'}};
  const current = {'ISC-101':{state:'PASSED',hidden:true}};
  assert.deepEqual(acknowledge(current,sent),current);
  assert.deepEqual(acknowledge(current,{'ISC-101':{state:'PASSED'}}),{'ISC-101':{hidden:true}});
});
test('la cola sobrevive recargas y queda aislada por cuenta', () => {
  const values = new Map(); const storage = {getItem:key=>values.get(key) || null};
  const pending = { ...emptySnapshot(), queue:{'ISC-101':{state:'PASSED'}} };
  values.set('ruta_v2:user-a',JSON.stringify(pending));
  assert.deepEqual(readCache(storage,'user-a').queue,pending.queue);
  assert.deepEqual(readCache(storage,'user-b').queue,{});
  assert.deepEqual(readCache(storage).queue,{});
});
test('importa el guardado original solo al espacio invitado', () => {
  const storage={getItem:key=>key==='isc_user_states_v5' ? '{"ISC-101":"PASSED"}' : null};
  assert.equal(readCache(storage).progress['ISC-101'],'PASSED');
  assert.equal(readCache(storage,'account').progress['ISC-101'],'PENDING');
});
test('reiniciar genera cambios explícitos que también se pueden sincronizar', () => {
  const snapshot = fromRows([{course_code:'ISC-101',state:'PASSED',hidden:true}]);
  assert.deepEqual(difference(snapshot,emptySnapshot()),{'ISC-101':{state:'PENDING',hidden:false}});
});
