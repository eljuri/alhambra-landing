# Plan CMS — Alhambra Shopping en Framer

Objetivo: que el equipo actualice el contenido que más cambia (eventos, marcas y restaurantes) desde el CMS de Framer, sin tocar código ni el lienzo.

Proyecto de Framer: «Alhambra Shopping». Staging: https://awesome-spinosaurus-775731.framer.app

---

## Cómo se conecta el CMS a los code components

Un code component de Framer no puede leer una colección del CMS por su cuenta. La URL del módulo de la colección lleva un hash de versión que cambia con cada edición, así que importarla dejaría los datos congelados. Por eso cada colección usa un **componente puente**:

1. En la página va una **Collection List** de la colección, **como primer hijo del frame Desktop** (antes que la sección que la usa).
2. Dentro de la plantilla de la lista va el componente puente (p. ej. `EventoCMS`), con cada propiedad conectada a su campo con **+ → Set variable**.
3. El puente no dibuja nada en el sitio (en el editor muestra una línea «CMS · título · fecha»). Registra su elemento en un almacén compartido durante el render.
4. La sección lo lee con un hook (p. ej. `useCmsEvents`). Si la página no tiene la lista, usa sus datos de ejemplo.

Reglas para que funcione:

- El almacén compartido está en `framer/CmsStore.tsx`. Al generar el HTML, la Collection List carga sus datos de forma asíncrona y React pintaba la sección antes que los puentes (el HTML salía con los datos de ejemplo y luego había parpadeo y errores de hidratación). Por eso la sección **se suspende** hasta que llega el primer elemento o pasan 1,5 s (servidor) / 0,8 s (navegador) si la página no tiene lista. En el editor y en la app local (`__ALHAMBRA_LOCAL__`) no espera.
- La Collection List trae **límite de 10 elementos**: subirlo a 100.
- La lista debe ir **antes** que la sección en el orden de capas; si no, los datos llegan tarde y hay parpadeo. En páginas con secciones en posición absoluta (Home), se deja en índice 0 con `zIndex` alto para poder seleccionarla en el editor.
- **No copiar y pegar** una Collection List entre páginas: la copia pierde la conexión con la colección (todo queda «Missing»). Hay que insertar una nueva en cada página.
- Solo el primer elemento de la lista es editable; los demás repiten sus conexiones.
- No usar campos de **texto enriquecido**: Framer no los conecta a una propiedad de texto y crea una transformación. Usar texto simple; los párrafos se separan con una línea en blanco.
- Las fechas se guardan con la **hora de Ecuador tal cual** (el CMS las muestra en UTC). El puente las lee en UTC para no desplazarlas.

---

## Fase 0 — Eventos ✅ hecho

**Colección `Eventos`** (5 elementos cargados desde `EventsAgenda.tsx`):

| Campo | Tipo | Uso |
| --- | --- | --- |
| Slug | slug | `/eventos?evento=<slug>` y `/eventos/<slug>` |
| Título | texto | |
| Fecha | fecha con hora | hora de Ecuador |
| Horario | texto | p. ej. «Desde las 12h00» |
| Etiqueta | texto | |
| Lugar | texto | |
| Resumen | texto | tarjetas |
| Descripción | texto simple | panel de detalle; párrafos con línea en blanco |
| Imagen | imagen | |
| Imagen extra | imagen | |
| Auspiciante 1, 2, 3 | imagen | el CMS no tiene listas de imágenes |
| Tiene registro | sí/no | muestra el formulario |
| Gratis | sí/no | |
| Texto del botón | texto | tarjetas del inicio |

**Código**

- `framer/EventsCms.tsx`: componente `EventoCMS` + `useCmsEvents()`.
- `framer/EventsAgenda.tsx` y `framer/Events.tsx` leen de `useCmsEvents(props.events)`.
- En el inicio, la fecha legible («Jueves, 30 de julio de 2026 · 14h00») se arma desde Fecha y Horario.

**En Framer**

- `/eventos`: Collection List «Eventos CMS» conectada, primer hijo de Desktop.
- Home: Collection List «Eventos CMS» conectada, índice 0, posición absoluta, `zIndex: 100`.
- Página de detalle `/eventos/:slug` creada (diseño automático de Framer, ver fase 3).

**Verificado en staging** (13/11/2026, tras `CmsStore.tsx`): el HTML del servidor del inicio ya trae los eventos del CMS («Música en vivo»), sin errores de hidratación. Antes solo se veían tras cargar en el navegador.

---

## Fase 1 — Marcas y Restaurantes ✅ hecho

Colecciones `Marcas` (25) y `Restaurantes` (9) cargadas; `framer/DirectoryCms.tsx` (`LocalCMS` + `useCmsLocals`); `Directory.tsx` lee del almacén y enlaza la tarjeta si hay «Enlace». En `/marcas` y `/restaurantes` la Collection List es el primer hijo de Desktop, con límite 100. **Verificado en staging** (13/11/2026): un nombre cambiado solo en el CMS aparece en el HTML del servidor y en el navegador, con todas las tarjetas y sin errores de hidratación. «Mostrar en el inicio» quedó en sí para los locales con logo (Local 13 no tiene).

**Colecciones `Marcas` (25) y `Restaurantes` (9)**, mismos campos:

| Campo | Tipo | Notas |
| --- | --- | --- |
| Slug | slug | |
| Nombre | texto | hoy son nombres de relleno («Local 1», «Restaurante 1»…): **hay que poner los reales** |
| Categorías | texto | separadas por coma, iguales a la lista de filtros |
| Foto | imagen | |
| Logo | imagen | |
| Logo tenue | sí/no | lo pasa a negro sólido |
| Enlace | link | opcional: web o Instagram del local |
| Orden | número | para ordenar la grilla |
| Mostrar en el inicio | sí/no | para la fase 2 |

Las categorías de los filtros (`CATEGORIES`) se quedan como propiedad del componente en el panel derecho. Cambian poco y así se controla el orden de los chips.

Alternativa que descarto por ahora: una colección `Categorías` con referencia múltiple. Es más robusta frente a errores de escritura, pero más compleja de mantener y de conectar.

**Pasos**

1. Crear las dos colecciones y cargar los datos actuales desde `Brands.tsx` y `Restaurants.tsx` (por MCP).
2. Escribir `framer/DirectoryCms.tsx`: componente `LocalCMS` + `useCmsLocals(collection, fallback)`, con un almacén por colección («marcas» / «restaurantes»).
3. `Directory.tsx` lee de `useCmsLocals`; `Brands.tsx` y `Restaurants.tsx` pasan el nombre de la colección.
4. Sync a Framer.
5. En `/marcas` y `/restaurantes`: insertar la Collection List, primer hijo de Desktop (la acomodo por MCP), meter `LocalCMS` y conectar los campos.
6. Publicar y verificar en staging.

---

## Fase 2 — Logos del inicio ✅ hecho

Hecho: `Logos.tsx` arma cada fila con `useCmsLocals` (solo «Mostrar en el inicio» y con logo). En Home hay dos Collection Lists («Marcas», «Restaurantes») ocultas como «Eventos CMS» (índice 1 y 2, absolutas, alto 0), filtradas por «Mostrar en el inicio» y con límite 100. **Verificado en staging**: el HTML del servidor trae los 24 + 9 logos del CMS, sin errores de hidratación.

Ojo: los PNG de logos vienen centrados en un lienzo transparente (p. ej. 240×131) y el CMS no sabe el tamaño del dibujo, así que el navegador mide el área visible de cada logo (canvas; framerusercontent permite CORS) y calcula su escala. Verificado: coincide con las medidas a mano de antes.

`Logos.tsx` tiene dos filas de logos (marcas y restaurantes) con datos propios, que duplican los del directorio.

- Leer las filas desde los almacenes de la fase 1, filtrando por «Mostrar en el inicio».
- En Home, insertar dos Collection Lists (Marcas y Restaurantes) filtradas por «Mostrar en el inicio = sí», en índice 0 como la de eventos.
- Si la lista está vacía, la fila usa sus datos de ejemplo.

---

## Fase 3 — Página de detalle de evento ✅ hecho (falta SEO)

Hecho:
- `framer/EventShared.tsx`: piezas comunes de la agenda y de la página (fechas, .ics, compartir, auspiciantes, datos, formulario de registro). `EventsAgenda.tsx` ya las usa.
- `framer/EventDetail.tsx`: franja oscura (volver, etiqueta, estado, título, datos) y debajo imagen fija + descripción, imagen extra, auspiciantes y acciones. Lee los campos con `toCmsEvent` (de `EventsCms.tsx`), igual que el puente. `/eventos/<slug>#registro` abre el formulario. Evento pasado: sin registro ni calendario.
- Las tarjetas del inicio enlazan a `/eventos/<slug>` (con `#registro` si tiene registro). «Agregar al calendario» y «Compartir» usan ya ese enlace.
- La agenda **mantiene su panel** (vista rápida) y suma «Ver página del evento»; `?evento=<slug>` sigue abriendo el panel, así que los enlaces ya compartidos no se rompen.
- En Framer, `/eventos/:slug` tiene Nav + EventDetail + Footer (se quitó el diseño automático).
- En local: `/eventos/<slug>` usa los eventos de ejemplo.

**Verificado en staging** (13/11/2026): las 5 páginas muestran los datos del CMS (título, fecha, lugar, descripción, auspiciantes, imagen extra), sin errores de hidratación; en eventos pasados solo queda «Compartir». Framer genera el HTML de algunas páginas CMS un rato después de publicar (mientras tanto el contenido se arma en el navegador).

Falta: el título de la pestaña sigue en «My Framer Site»; poner título y descripción SEO de la página CMS (Título + « · Alhambra Shopping», Resumen).


`/eventos/:slug` existe con el diseño automático de Framer.

- Crear `EventDetail.tsx` con el diseño del panel de la agenda (imagen, fecha, lugar, descripción, auspiciantes, registro, agregar al calendario, compartir), con propiedades conectadas directamente a los campos de la página CMS (aquí no hace falta puente).
- Apuntar las tarjetas del inicio y de la agenda a `/eventos/<slug>` en lugar de `?evento=`.
- Mantener `?evento=` como redirección para los enlaces ya compartidos.
- Título y descripción SEO de la página CMS conectados a Título y Resumen.

---

## Lo que no va al CMS

Cambia poco y ya se edita desde el panel derecho de cada componente: FAQ del Salón, espacios y planos, galería, textos de los heros, menú, footer, cinta de categorías, formulario de reservas y suscripción.

---

## Pendientes generales

- [ ] **Título y descripción del sitio**: Framer publica «My Framer Site». Cambiar en Site Settings → General con los textos de `app/index.html`.
- [ ] Títulos SEO de cada página: «Eventos · Alhambra Shopping», «Salón Auditorio · Alhambra Shopping», etc.
- [ ] Apagar «Animar entrada» en el Nav de `/eventos` y `/salonauditorio` (en local solo el inicio anima).
- [ ] Breakpoints Tablet (810) y Phone (390): se agregan con el **+** junto a «Desktop 1200». Ninguna página los tiene todavía.
- [ ] El Desktop de Home tiene alto fijo (7113 px) y secciones en posición absoluta, a diferencia de las otras páginas (pila vertical, alto automático). Conviene pasarlo a pila para que no se corte si una sección crece.
- [ ] Borrar la colección vacía de ejemplo «Collection».
