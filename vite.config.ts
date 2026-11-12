import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { buildStyles } from "./scripts/build-styles.mjs"

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// Regenera framer/Styles.tsx al arrancar y cada vez que cambia styles.css
function stylesPlugin(): Plugin {
    return {
        name: "alhambra-styles",
        buildStart() {
            buildStyles()
        },
        configureServer(server) {
            server.watcher.add(here("./styles.css"))
            server.watcher.on("change", (file) => {
                if (file === here("./styles.css")) buildStyles()
            })
        },
    }
}

export default defineConfig({
    root: "app",
    plugins: [stylesPlugin(), react()],
    resolve: {
        // En local "framer" es una imitación; en Framer es el módulo real
        alias: { framer: here("./app/framer-shim.ts") },
    },
    server: { fs: { allow: [here(".")] } },
    build: { outDir: here("./dist"), emptyOutDir: true },
})
