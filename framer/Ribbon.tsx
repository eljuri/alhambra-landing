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

    // Repite las palabras hasta cubrir 1,5 pantallas y duplica para el bucle
    useEffect(() => {
        const el = track.current
        if (!el) return
        const fit = () => {
            const one = el.scrollWidth / copies
            if (!one) return
            const need = Math.min(Math.max(Math.ceil((window.innerWidth * 1.5) / one), 1), 10)
            setCopies(need * 2)
        }
        document.fonts?.ready.then(fit)
        fit()
    }, [words.join("|")])

    useEffect(() => {
        const el = track.current
        if (!el || reduceMotion() || isCanvas() || !("IntersectionObserver" in window)) return
        let x = 0, spin = 0, raf = 0, visible = false
        const period = () => {
            const half = el.children.length / 2
            const a = el.children[0] as HTMLElement
            const b = el.children[half] as HTMLElement
            return b && a ? b.offsetLeft - a.offsetLeft : 0
        }
        const step = () => {
            raf = 0
            if (!visible) return
            const speed = 0.8
            const p = period()
            x -= speed
            if (p) {
                if (x <= -p) x += p
                if (x > 0) x -= p
            }
            spin += speed * 1.6
            el.style.setProperty("--x", `${x.toFixed(2)}px`)
            el.style.setProperty("--spin", `${(spin % 360).toFixed(1)}deg`)
            raf = requestAnimationFrame(step)
        }
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (visible && !raf) raf = requestAnimationFrame(step)
        })
        io.observe(el)
        return () => {
            io.disconnect()
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
