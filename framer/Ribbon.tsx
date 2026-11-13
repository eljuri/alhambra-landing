// Alhambra Shopping — cinta de categorías que corre sola a velocidad fija
import { Fragment, useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, ROOT_CLASS, reduceMotion } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"

const WORDS = ["Moda", "Gastronomía", "Belleza", "Eventos", "Hogar", "Experiencias"]

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Ribbon(props) {
    useAlhambraStyles()
    const words: string[] = props.words?.length ? props.words : WORDS
    const track = useRef<HTMLDivElement>(null)
    const [copies, setCopies] = useState(2)

    // Repite las palabras hasta cubrir 1,5 pantallas y duplica para el bucle.
    // Se recalcula al cambiar el tamaño de la ventana.
    useEffect(() => {
        const el = track.current
        if (!el) return
        const fit = () => {
            const current = el.children.length / (2 * words.length) || 1
            const one = el.scrollWidth / current
            if (!one) return
            const need = Math.min(Math.max(Math.ceil((window.innerWidth * 1.5) / one), 1), 10)
            setCopies(need * 2)
        }
        let timer = 0
        const onResize = () => {
            clearTimeout(timer)
            timer = window.setTimeout(fit, 150)
        }
        document.fonts?.ready.then(fit)
        fit()
        window.addEventListener("resize", onResize)
        return () => {
            clearTimeout(timer)
            window.removeEventListener("resize", onResize)
        }
    }, [words.join("|")])

    // Movimiento por tiempo (igual en 60 y 120 Hz). El scroll empuja la
    // cinta: acelera mientras se desplaza la página, invierte el sentido al
    // subir y vuelve poco a poco a su ritmo.
    useEffect(() => {
        const el = track.current
        if (!el || reduceMotion() || isCanvas() || !("IntersectionObserver" in window)) return
        const BASE = 48 // px por segundo
        const MAX_BOOST = BASE * 10
        let x = 0, spin = 0, raf = 0, last = 0, visible = false
        let dir = 1, base = BASE, boost = 0
        let lastY = window.scrollY
        const period = () => {
            const half = el.children.length / 2
            const a = el.children[0] as HTMLElement
            const b = el.children[half] as HTMLElement
            return b && a ? b.offsetLeft - a.offsetLeft : 0
        }
        const step = (now: number) => {
            raf = 0
            if (!visible) return
            const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
            last = now
            base += (dir * BASE - base) * (1 - Math.exp(-dt * 4))
            boost *= Math.exp(-dt * 3)
            const speed = base + boost
            const p = period()
            x -= speed * dt
            if (p) {
                if (x <= -p) x += p
                if (x > 0) x -= p
            }
            spin += speed * dt * 1.6
            el.style.setProperty("--x", `${x.toFixed(2)}px`)
            el.style.setProperty("--spin", `${(spin % 360).toFixed(1)}deg`)
            raf = requestAnimationFrame(step)
        }
        const onScroll = () => {
            const y = window.scrollY
            const dy = y - lastY
            lastY = y
            if (!visible || !dy) return
            dir = dy > 0 ? 1 : -1
            boost = Math.max(-MAX_BOOST, Math.min(MAX_BOOST, boost + dy * 8))
        }
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (visible && !raf) {
                last = 0
                raf = requestAnimationFrame(step)
            }
        })
        io.observe(el)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            io.disconnect()
            window.removeEventListener("scroll", onScroll)
            cancelAnimationFrame(raf)
        }
    }, [])

    const items = Array.from({ length: copies }, () => words).flat()
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }}>
            <div className="ribbon" aria-hidden="true">
                <div className="ribbon__track" ref={track}>
                    {items.map((w, i) => (
                        <Fragment key={i}>
                            <span className={i % 2 ? "ribbon__alt" : undefined}>{w}</span>
                            <i></i>
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

Ribbon.defaultProps = { words: WORDS }

addPropertyControls(Ribbon, {
    words: {
        type: ControlType.Array,
        title: "Palabras",
        control: { type: ControlType.String },
        defaultValue: WORDS,
    },
})
