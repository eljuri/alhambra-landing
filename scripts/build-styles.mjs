// Genera framer/Styles.tsx a partir de styles.css.
// Framer no carga archivos .css en los code components, así que la hoja se
// inyecta como texto. Además la acota a .alh para no afectar al editor de
// Framer y apunta las fuentes a jsDelivr (repo público).
//
// Uso: node scripts/build-styles.mjs   (también lo ejecuta Vite al arrancar
// y cada vez que cambia styles.css)
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
// Commit fijo para que jsDelivr sirva siempre los mismos archivos de fuentes
const FONTS_REF = "c267f72eb0d8d53817049aebb9715c3929ad74bb"
const FONTS = `https://cdn.jsdelivr.net/gh/luis-gomez-91/alhambra@${FONTS_REF}/fonts/`

// :where() acota a .alh sin sumar especificidad: estas reglas siguen
// perdiendo contra las clases, igual que los selectores de etiqueta originales
const GLOBALS = `:where(.alh) *,
:where(.alh) *::before,
:where(.alh) *::after { box-sizing: border-box; }

.alh {
  margin: 0;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

:where(.alh) img { display: block; max-width: 100%; height: auto; }
:where(.alh) :is(ul, ol) { list-style: none; margin: 0; padding: 0; }
:where(.alh) figure { margin: 0; }
:where(.alh) :is(h1, h2, h3, p) { margin: 0; }
:where(.alh) a { color: inherit; }
:where(.alh) button { font: inherit; color: inherit; }

:where(.alh) :focus-visible {
  outline: 2px solid var(--sand-deep);
  outline-offset: 3px;
  border-radius: 4px;
}

`

const replaceOnce = (css, from, to) => {
    if (!css.includes(from)) throw new Error(`build-styles: no se encontró «${from.slice(0, 40)}» en styles.css`)
    return css.replace(from, to)
}

export function buildStyles() {
    let css = readFileSync(join(ROOT, "styles.css"), "utf8")
    css = css.replaceAll('url("fonts/', `url("${FONTS}`)

    // Reglas globales (html, body, img, a…) → acotadas a .alh
    const start = css.indexOf("*,\n*::before,\n*::after { box-sizing")
    const end = css.indexOf(".container {")
    if (start < 0 || end < 0) throw new Error("build-styles: no se encontró el bloque de reglas globales")
    css = css.slice(0, start) + GLOBALS + css.slice(end)

    css = replaceOnce(css, ":root {", ":root, .alh {")
    css = replaceOnce(css, "body.menu-open {", "body.alh-menu-open {")
    css = css.replace(/html:not\(\.js\) \.ribbon__track \{[^}]*\}\n/, "")
    css = css.replaceAll(".js .page-home", ".js.page-home")
    css = replaceOnce(
        css,
        "  html { scroll-behavior: auto; }\n  *,\n  *::before,\n  *::after {",
        "  :where(.alh) *,\n  :where(.alh) *::before,\n  :where(.alh) *::after {"
    )
    css += "\n/* Framer: cada sección es un componente independiente */\n.alh-section { width: 100%; }\n"

    if (css.includes("`") || css.includes("${")) throw new Error("build-styles: styles.css no puede contener ` ni ${")

    const out = `// GENERADO por scripts/build-styles.mjs desde styles.css. No editar a mano.\nexport const CSS = \`${css.replaceAll("\\", "\\\\")}\`\n`
    writeFileSync(join(ROOT, "framer/Styles.tsx"), out)
    return out.length
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    console.log(`framer/Styles.tsx (${buildStyles()} caracteres)`)
}
