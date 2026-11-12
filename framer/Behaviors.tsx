// Alhambra Shopping — comportamientos compartidos (portados de main.js)
import { useEffect } from "react"
import { RenderTarget } from "framer"
import { reduceMotion } from "./Theme.tsx"

export const isCanvas = () => RenderTarget.current() === RenderTarget.canvas

const finePointer = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches

// [data-magnetic]: el elemento se acerca al cursor dentro de su zona
export function useMagnetic(root: React.RefObject<HTMLElement>) {
    useEffect(() => {
        const host = root.current
        if (!host || !finePointer() || reduceMotion()) return
        const offs: Array<() => void> = []
        host.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
            const zone = (el.matches("a, button") ? el : el.closest("a, button")) as HTMLElement || el
            const clamp = (v: number) => Math.max(-12, Math.min(12, v))
            const move = (e: PointerEvent) => {
                const r = el.getBoundingClientRect()
                el.style.setProperty("--tx", `${clamp((e.clientX - (r.left + r.width / 2)) * 0.25).toFixed(1)}px`)
                el.style.setProperty("--ty", `${clamp((e.clientY - (r.top + r.height / 2)) * 0.35).toFixed(1)}px`)
            }
            const leave = () => {
                el.style.setProperty("--tx", "0px")
                el.style.setProperty("--ty", "0px")
            }
            zone.addEventListener("pointermove", move)
            zone.addEventListener("pointerleave", leave)
            offs.push(() => {
                zone.removeEventListener("pointermove", move)
                zone.removeEventListener("pointerleave", leave)
            })
        })
        return () => offs.forEach((off) => off())
    }, [])
}

// Cursor «Ver»: círculo que sigue al mouse sobre los elementos [data-cursor]
export function useCursor(root: React.RefObject<HTMLElement>) {
    useEffect(() => {
        const host = root.current
        if (!host || !finePointer() || reduceMotion() || isCanvas()) return
        if (!host.querySelector("[data-cursor]")) return
        host.classList.add("has-cursor")
        const cursor = document.createElement("div")
        cursor.className = "cursor"
        cursor.setAttribute("aria-hidden", "true")
        // El cursor vive fuera del componente, pero necesita los tokens de .alh
        cursor.style.cssText = "background:#f5f0e9;color:#16130f;font-family:'Neutraface Text',sans-serif;transform:scale(0)"
        document.body.append(cursor)

        let x = 0, y = 0, cx = 0, cy = 0, scale = 0, scaleTo = 0
        let following = false
        let hideTimer = 0 as any

        const follow = () => {
            cx += (x - cx) * 0.55
            cy += (y - cy) * 0.55
            scale += (scaleTo - scale) * 0.35
            if (scale < 0.01) scale = 0
            cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(${scale})`
            if (Math.abs(x - cx) > 0.4 || Math.abs(y - cy) > 0.4 || Math.abs(scaleTo - scale) > 0.01) {
                requestAnimationFrame(follow)
            } else following = false
        }
        const start = () => {
            if (following) return
            following = true
            requestAnimationFrame(follow)
        }
        const place = (show: boolean) => {
            clearTimeout(hideTimer)
            if (show) {
                if (scaleTo === 0) { cx = x; cy = y }
                scaleTo = 1
                start()
                return
            }
            hideTimer = setTimeout(() => { scaleTo = 0; start() }, 50)
        }
        const move = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            x = e.clientX
            y = e.clientY
            const target = (e.target as HTMLElement).closest?.("[data-cursor]") as HTMLElement | null
            if (target && host.contains(target)) cursor.textContent = target.dataset.cursor || ""
            place(Boolean(target && host.contains(target)))
            start()
        }
        const onScroll = () => {
            const under = document.elementFromPoint(x, y)
            place(Boolean(under && under.closest("[data-cursor]") && host.contains(under)))
        }
        document.addEventListener("pointermove", move)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            document.removeEventListener("pointermove", move)
            window.removeEventListener("scroll", onScroll)
            cursor.remove()
        }
    }, [])
}

export const hasFinePointer = finePointer

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
export const parseDate = (value: string) =>
    new Date(String(value).includes("T") ? value : `${value}T00:00`)
export const monthShort = (d: Date) => MONTHS[d.getMonth()]
