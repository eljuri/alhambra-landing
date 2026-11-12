// Alhambra Shopping — tema compartido para los code components.
// Inyecta una sola vez la hoja de estilos de la landing (Styles.tsx, generado
// desde styles.css) y los íconos Phosphor.
import { Fragment, useEffect, useLayoutEffect } from "react"
import { CSS } from "./Styles.tsx"


const PHOSPHOR = "https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css"
export const IMG = (name: string) => `https://framerusercontent.com/images/${name}`
export const REPO = "https://cdn.jsdelivr.net/gh/luis-gomez-91/alhambra@c267f72eb0d8d53817049aebb9715c3929ad74bb"

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect

export function useAlhambraStyles() {
    useIso(() => {
        if (typeof document === "undefined") return
        if (!document.getElementById("alh-css")) {
            const style = document.createElement("style")
            style.id = "alh-css"
            style.textContent = CSS
            document.head.appendChild(style)
        }
        if (!document.getElementById("alh-icons")) {
            const link = document.createElement("link")
            link.id = "alh-icons"
            link.rel = "stylesheet"
            link.href = PHOSPHOR
            document.head.appendChild(link)
        }
    }, [])
}

export const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Revelado al entrar en pantalla: replica .reveal / .is-visible de main.js
export function useReveal(root: React.RefObject<HTMLElement>) {
    useEffect(() => {
        const el = root.current
        if (!el) return
        const items = Array.from(el.querySelectorAll<HTMLElement>(".reveal"))
        const settle = (item: HTMLElement) => {
            item.classList.remove("reveal", "is-visible")
            item.style.removeProperty("--delay")
        }
        if (reduceMotion() || !("IntersectionObserver" in window)) {
            items.forEach(settle)
            return
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    const item = entry.target as HTMLElement
                    item.classList.add("is-visible")
                    const last = item.classList.contains("reveal--stagger")
                        ? item.lastElementChild
                        : item
                    item.addEventListener("transitionend", (ev) => {
                        if (ev.target === last && (ev as TransitionEvent).propertyName === "opacity")
                            settle(item)
                    })
                    io.unobserve(item)
                })
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
        )
        items.forEach((item) => io.observe(item))
        return () => io.disconnect()
    }, [])
}

// Título por palabras con máscara (.split / .split__w)
export function Split({ text, as: Tag = "h2", className = "", id }: any) {
    const words = String(text || "").split(/\s+/).filter(Boolean)
    return (
        <Tag className={`${className} split`} id={id}>
            {words.map((w, i) => (
                <Fragment key={i}>
                    <span className="split__w">
                        <span style={{ ["--i" as any]: i }}>{w}</span>
                    </span>
                    {i < words.length - 1 ? " " : ""}
                </Fragment>
            ))}
        </Tag>
    )
}

// Imagen desde un control de Framer (string o ResponsiveImage) con respaldo
export const src = (value: any, fallback = "") =>
    (value && typeof value === "object" ? value.src : value) || fallback

export const ROOT_CLASS = "alh js page-home"
