# Alhambra Shopping

Landing de Alhambra Shopping. Las secciones son componentes React que corren
igual en local (Vite) y en Framer (code components).

## Estructura

| Ruta | Qué es |
|---|---|
| `framer/` | **Fuente única** de las secciones (`Hero.tsx`, `Events.tsx`…). Se suben tal cual a Framer. |
| `framer/Styles.tsx` | Generado desde `styles.css`. No editar a mano. |
| `styles.css` | Estilos de la landing. Edita aquí. |
| `app/` | Página local de Vite que arma las secciones con sus valores por defecto. |
| `app/framer-shim.ts` | Imitación del módulo `framer` para que los componentes corran en Vite. |
| `scripts/` | Generador de estilos y sincronización con Framer. |
| `fonts/`, `video/`, `imagenes/` | Recursos que Framer carga desde este repo vía jsDelivr (commit fijo). No borrar. |

## Páginas

| Ruta | Secciones |
|---|---|
| `/` | Nav, Hero, Ribbon, Events, Discover, Subscribe, Logos, Footer |
| `/marcas` | Nav (sin animar entrada), PageHero, Brands, Footer |
| `/restaurantes` | Nav (sin animar entrada), PageHero (valores de `RESTAURANTS_HERO`), Restaurants, Footer |

`Brands.tsx` y `Restaurants.tsx` solo traen datos; el buscador y los chips viven
en `Directory.tsx`, que no es un componente sino código compartido.

La versión HTML original (antes de React) quedó en el historial de git, en el commit `c267f72`.

## Comandos

```bash
npm install
npm run dev        # http://localhost:5173 con recarga en vivo
npm run build      # sitio estático en dist/
npm run sync       # sube framer/*.tsx al proyecto de Framer
npm run sync Hero  # solo esa sección
```

`npm run sync` necesita el plugin **Design Bridge MCP** abierto en el proyecto
de Framer y su URL en `.env.local` (no se versiona):

```
FRAMER_MCP_URL=https://framer-mcp-relay…/mcp?userId=…
```

## Reglas para que todo siga funcionando en Framer

- Un archivo por sección en `framer/`, con el contenido como props y
  `addPropertyControls` para que se edite desde el panel de Framer.
- Imports solo entre archivos de `framer/` (con extensión `.tsx`), `react` y `framer`.
- Imágenes y videos por URL (CDN de Framer, jsDelivr o subidos a Framer), nunca importados.
- Estilos en `styles.css` con clases; no usar backticks ni `${` (se inyecta como texto).
- Una sección nueva se inserta en Framer desde Assets → Code tras el primer `npm run sync`.
