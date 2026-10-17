# Mi ruta · Sistemas UNAH

Planificador independiente de Ingeniería en Sistemas Computacionales. Mantiene el catálogo entregado por el usuario: 54 asignaturas y 216 UV. Verifica los requisitos con la UNAH antes de matricular.

Página pública: https://abrilsamay.github.io/Study-plan-UNAH/

## Uso y estado actual

El diseño se adapta a PC, tablet y teléfono. Los nombres aparecen primero; requisitos y continuidad se despliegan a demanda. Incluye búsqueda, filtros, modo oscuro, respaldo JSON e importación compatible con la versión original.

**La conexión a la nube queda pendiente hasta que el propietario conecte su nueva cuenta de Supabase.** Mientras `01-datos/nube.js` tenga valores vacíos, la página solo guarda en este navegador y lo indica expresamente. No muestra una sincronización ficticia.

## Ejecutar

Para usar la versión ya generada, abre `index.html` o ejecuta `python3 -m http.server 4173` y visita http://localhost:4173.

Para desarrollar, necesitas Node.js 22 o superior:

```sh
npm ci
npm run build
npm test
```

Edita los módulos y vuelve a generar `03-interfaz/app.bundle.js` con `npm run build`. No edites el bundle a mano. Las bibliotecas están fijadas por versión y `package-lock.json`.

## Orden de lectura

1. `01-datos/`: catálogo y configuración pública de conexión.
2. `02-logica/plan.js`: requisitos, estados y validación de respaldos.
3. `02-logica/01-almacenamiento/`: copia local por cuenta, diferencias y cola offline.
4. `02-logica/02-nube/`: cliente oficial, sesión, envíos y recepción de cambios.
5. `03-interfaz/`: pantalla principal y componentes de las tarjetas.
6. `04-estilos/`: entrada CSS, tokens, componentes y adaptación responsive.
7. `05-pruebas/`: regresiones de requisitos, cola y conflictos.
8. `06-herramientas/`: generación de la entrada del navegador.
9. `07-base-de-datos/`: esquema y políticas para el proyecto Supabase autorizado.

## Completar la conexión a la nube

1. Conectar la cuenta Supabase elegida y crear un proyecto gratuito autorizado.
2. Aplicar `07-base-de-datos/esquema.sql` en ese proyecto nuevo. Habilita RLS, políticas por propietario y Realtime.
3. Configurar la URL del sitio y las redirecciones de Auth para la dirección pública de GitHub Pages.
4. Habilitar y verificar el método de registro. Para correo/contraseña, la confirmación de correo viene activada por defecto. Supabase restringe el envío predeterminado a direcciones del equipo; un registro público necesita SMTP propio o un proveedor social configurado. No desactivar confirmaciones como atajo.
5. Completar `01-datos/nube.js` solo con URL y clave **publishable**. Nunca publicar `service_role`, claves secretas ni contraseñas.
6. Generar el bundle, probar con dos sesiones de la misma cuenta y verificar el aislamiento de otra cuenta antes de dar por terminada la sincronización.

## Comportamiento de sincronización implementado

- Cada cuenta utiliza su propia copia local; el invitado conserva el guardado anterior.
- El usuario elige si incorpora su avance anterior a la cuenta. No se reemplaza automáticamente el avance remoto.
- Se envían diferencias por asignatura y campo, no el plan completo. Editar materias diferentes desde dos equipos no las sobrescribe entre sí.
- Realtime notifica cambios y se recupera el avance al volver a la pestaña, reconectar o cada 15 segundos con la página visible.
- Si ambos dispositivos modifican el mismo campo, gana el último cambio que acepta el servidor.
- Las ediciones sin red permanecen en cola. El aviso de sincronizado aparece después de la confirmación del servidor.
- Reinicio, importación y clases ocultas también se sincronizan al tener sesión.

## Progreso y respaldos

La copia local depende del navegador. Al cambiar desde un HTML local a la página publicada, descarga e importa un respaldo para trasladar el avance. No subas respaldos personales al repositorio.

Conserva respaldos descargables incluso después de activar la nube: el plan gratuito de Supabase puede pausarse por inactividad y no incluye garantías de conservación permanente.

## Validación

Las pruebas cubren requisitos, PPS, respaldos, cambios en materias distintas, diferencias de campos, confirmaciones de envío y separación por cuenta. La comprobación completa contra una base real sigue pendiente de conectar la cuenta autorizada.

Licencia: GPL-3.0, conservada del repositorio original.
