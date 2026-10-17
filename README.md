# Mi ruta académica · ISC

Rediseño local del plan recibido en `pagina unah test.zip`. Herramienta independiente: el catálogo se conserva tal como fue entregado y debe verificarse con la UNAH antes de usarlo para matrícula.

## Ejecutar

Necesitas Python 3. Desde esta carpeta ejecuta:

```sh
python3 -m http.server 4173
```

Abre http://localhost:4173. También puedes abrir `index.html` directamente: la entrada generada carga sin servidor. No hay dependencias externas, fuentes remotas ni instalación de paquetes.

## Orden de lectura y flujo

1. `01-datos/curriculum.js`: fuente del catálogo, UV y prerrequisitos.
2. `02-logica/plan.js`: transforma esos datos en estados, requisitos pendientes y respaldos validados. Encapsula el almacenamiento.
3. `03-interfaz/app.js`: conecta eventos del usuario con lógica, guardado y actualización de la pantalla.
4. `04-estilos/principal.css`: tokens visuales, estructura, componentes, adaptación móvil y movimiento CSS.
5. `05-pruebas/plan.test.js`: verifica cadenas de requisitos, PPS y respaldos.

`index.html` define la estructura semántica de arriba hacia abajo. Los comentarios en spanglish explican responsabilidades y decisiones. Los números indican el orden de lectura; los imports expresan las dependencias reales. No se agregaron niveles de carpetas vacíos: cada carpeta representa una responsabilidad.

## Funciones

- Avance pendiente, en curso y aprobado, con desbloqueo por requisitos.
- Resumen global de 54 materias y 216 UV calculado desde el catálogo.
- Búsqueda sin distinguir acentos, filtros por estado y navegación por área.
- Tres sugerencias visibles, navegación hasta cada materia y ocultar/restaurar sugerencias.
- Requisitos y continuidad desplegables para reducir información simultánea.
- Modo oscuro, respaldo JSON, importación validada y reinicio con confirmación.
- Guardado compatible con las claves y respaldos originales.
- Diseño adaptable, foco de teclado, etiquetas accesibles y respeto a movimiento reducido.

## Datos y privacidad

El avance vive en este navegador. Al cambiar de dominio, dispositivo o perfil, importa un respaldo para trasladarlo. Al desmarcar un prerrequisito se conserva el estado registrado en materias posteriores, igual que en el original: no se borra historial automáticamente. Las materias bloqueadas no pueden cambiarse desde el selector hasta completar sus requisitos.

Los respaldos no se incluyen en el proyecto. Antes de publicar en GitHub revisa que no existan datos personales. Repositorio público: https://github.com/AbrilSamay/Study-plan-UNAH. La página aún no se ha desplegado en un servidor público.

## Verificar lógica

Con Node.js:

```sh
node --test 05-pruebas/plan.test.js
```

## Próximas revisiones de diseño

Validar la densidad de las tarjetas con uso real, probar teclado y pantalla móvil, y acordar los ajustes visuales antes de preparar GitHub y hosting.

## Actualizar la entrada del navegador

Después de editar el código fuente ejecuta `node 06-herramientas/preparar.mjs`. Este paso genera `03-interfaz/app.bundle.js`, que permite abrir el HTML directamente sin que el navegador bloquee los módulos. El ZIP ya incluye la entrada actualizada.
