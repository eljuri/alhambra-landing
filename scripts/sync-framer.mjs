// Sube los componentes de framer/ al proyecto de Framer por el MCP del plugin
// «Design Bridge MCP» (debe estar abierto en el proyecto).
//
// Uso: npm run sync            → sube todos los .tsx de framer/
//      npm run sync Hero Nav   → solo esos
//
// La URL del servidor va en .env.local (no se versiona):
//   FRAMER_MCP_URL=https://framer-mcp-relay…/mcp?userId=…
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, basename } from "node:path"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

function loadEnv() {
    const file = join(ROOT, ".env.local")
    if (!existsSync(file)) return
    for (const line of readFileSync(file, "utf8").split("\n")) {
        const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "")
    }
}
loadEnv()

const URL = process.env.FRAMER_MCP_URL
if (!URL) {
    console.error("Falta FRAMER_MCP_URL en .env.local (cópiala del plugin Design Bridge MCP).")
    process.exit(1)
}

async function call(name, args = {}) {
    const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
    })
    let raw = await res.text()
    if (raw.startsWith("event:") || raw.startsWith("data:")) {
        raw = raw.split("\n").filter((l) => l.startsWith("data:")).at(-1).slice(5)
    }
    const data = JSON.parse(raw)
    if (data.error) throw new Error(`${name}: ${JSON.stringify(data.error)}`)
    const text = (data.result.content || []).map((c) => c.text || "").join("\n")
    if (data.result.isError) throw new Error(`${name}: ${text}`)
    try { return JSON.parse(text) } catch { return text }
}

const only = process.argv.slice(2).map((n) => n.replace(/\.tsx$/, "") + ".tsx")
const local = readdirSync(join(ROOT, "framer"))
    .filter((f) => f.endsWith(".tsx"))
    .filter((f) => !only.length || only.includes(f))

try {
    const remote = new Map((await call("codeFiles_list")).codeFiles.map((f) => [f.name, f]))
    // Primero los módulos compartidos, para que los demás compilen contra la versión nueva
    const order = ["Styles.tsx", "Theme.tsx", "Behaviors.tsx"]
    local.sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99))

    for (const file of local) {
        const code = readFileSync(join(ROOT, "framer", file), "utf8")
        const existing = remote.get(file)
        if (existing) {
            const current = await call("codeFiles_get", { id: existing.id })
            if ((current.codeFile?.code ?? current.code) === code) {
                console.log(`= ${file} (sin cambios)`)
                continue
            }
            await call("codeFiles_setContent", { id: existing.id, code })
            console.log(`↑ ${file}`)
        } else {
            await call("codeFiles_create", { name: basename(file), code })
            console.log(`+ ${file} (nuevo: insértalo desde Assets → Code)`)
        }
    }
    await call("editor_notify", { message: "Componentes de Alhambra sincronizados" }).catch(() => {})
} catch (err) {
    console.error(`No se pudo sincronizar: ${err.message}`)
    console.error("¿Está abierto el plugin Design Bridge MCP en el proyecto de Framer?")
    process.exit(1)
}
