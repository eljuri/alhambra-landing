// Alhambra Shopping — «De auditorio a salón»: comparador de dos fotos tomadas
// desde el mismo punto. Se arrastra (mouse o dedo), se mueve con el teclado
// (input range) o se cambia con los botones Auditorio / Salón.
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, src, Split, ROOT_CLASS, useReveal, reduceMotion } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"

const FEATURES = [
    { icon: "armchair", text: "240 butacas que se abaten solas" },
    { icon: "projector-screen", text: "Proyector láser Ultra HD 4K" },
    { icon: "frame-corners", text: "Pantalla retráctil de 280 pulgadas" },
    { icon: "speaker-hifi", text: "Sonido surround" },
    { icon: "timer", text: "Cambio de formato en 5 minutos" },
]

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function VenueShift(props) {
    useAlhambraStyles()
    const { eyebrow, title, lead, before, beforeUrl, beforeLabel, after, afterUrl, afterLabel, features } = props
    const root = useRef<HTMLDivElement>(null)
    const box = useRef<HTMLDivElement>(null)
    const [pos, setPos] = useState(50)
    const [glide, setGlide] = useState(false)
    const timer = useRef<any>(0)
    useReveal(root)

    // Movimiento animado (botones y la pista inicial); el arrastre va directo
    const glideTo = (value: number) => {
        clearTimeout(timer.current)
        setGlide(!reduceMotion())
        setPos(value)
        timer.current = setTimeout(() => setGlide(false), 900)
    }

    // La primera vez que se ve, el divisor se asoma a cada lado para invitar a arrastrar
    useEffect(() => {
        const el = box.current
        if (!el || reduceMotion() || isCanvas() || !("IntersectionObserver" in window)) return
        const steps: any[] = []
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                io.disconnect()
                steps.push(setTimeout(() => glideTo(68), 500))
                steps.push(setTimeout(() => glideTo(34), 1300))
                steps.push(setTimeout(() => glideTo(50), 2100))
            },
            { threshold: 0.6 }
        )
        io.observe(el)
        return () => {
            io.disconnect()
            steps.forEach(clearTimeout)
            clearTimeout(timer.current)
        }
    }, [])

    const fromPointer = (e: React.PointerEvent) => {
        const r = box.current!.getBoundingClientRect()
        setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)))
    }
    const onDown = (e: React.PointerEvent) => {
        if (e.button !== 0) return
        clearTimeout(timer.current)
        setGlide(false)
        box.current!.setPointerCapture(e.pointerId)
        fromPointer(e)
    }
    const onMove = (e: React.PointerEvent) => {
        if (box.current!.hasPointerCapture(e.pointerId)) fromPointer(e)
    }

    const reveal = isCanvas() ? "" : " reveal"
    const showing = pos > 50 ? "before" : pos < 50 ? "after" : ""
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            <section className="section venue-shift" aria-labelledby="shift-title">
                <div className="container venue-shift__grid">
                    <div className="venue-shift__text">
                        <header className={`discover__head${reveal} reveal--stagger`}>
                            <p className="eyebrow-title eyebrow-title--dark">{eyebrow}</p>
                            <Split className="discover__title" id="shift-title" text={title} />
                            <p className="discover__lead">{lead}</p>
                        </header>
                        <ul className={`venue-features${reveal}`}>
                            {(features || []).map((f, i) => (
                                <li key={i}>
                                    <i className={`ph ph-${f.icon}`} aria-hidden="true"></i>
                                    {f.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`venue-shift__media${reveal}`}>
                        <div
                            className={`compare${glide ? " is-gliding" : ""}`}
                            ref={box}
                            style={{ ["--pos" as any]: `${pos}%` }}
                            onPointerDown={onDown}
                            onPointerMove={onMove}
                        >
                            <img className="compare__img" src={src(after, afterUrl)} alt={`${afterLabel}: el mismo espacio sin butacas`} draggable={false} loading="lazy" />
                            <img className="compare__img compare__top" src={src(before, beforeUrl)} alt={`${beforeLabel}: filas de butacas frente al escenario`} draggable={false} loading="lazy" />
                            <span className="compare__tag compare__tag--left" aria-hidden="true">{beforeLabel}</span>
                            <span className="compare__tag compare__tag--right" aria-hidden="true">{afterLabel}</span>
                            <span className="compare__line" aria-hidden="true">
                                <span className="compare__knob"><i className="ph ph-arrows-left-right"></i></span>
                            </span>
                            <input
                                className="compare__range"
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={Math.round(pos)}
                                onChange={(e) => setPos(Number(e.target.value))}
                                aria-label={`Comparar ${beforeLabel.toLowerCase()} y ${afterLabel.toLowerCase()}`}
                                aria-valuetext={`${Math.round(pos)}% ${beforeLabel.toLowerCase()}`}
                            />
                        </div>
                        <div className="venue-toggle" role="group" aria-label="Formato del espacio">
                            <button type="button" aria-pressed={showing === "before"} onClick={() => glideTo(100)}>
                                <i className="ph ph-armchair" aria-hidden="true"></i> {beforeLabel}
                            </button>
                            <button type="button" aria-pressed={showing === "after"} onClick={() => glideTo(0)}>
                                <i className="ph ph-champagne" aria-hidden="true"></i> {afterLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

VenueShift.defaultProps = {
    eyebrow: "Un espacio, dos formatos",
    title: "De auditorio a salón en cinco minutos",
    lead: "Con aplastar un botón las butacas se abaten y el auditorio se vuelve un salón libre, ideal para todo tipo de eventos sociales y corporativos. Arrastra para ver el cambio.",
    beforeUrl: IMG("GkhOtqCoHc8Qik1hUb2vwTXDyQQ.jpg"),
    beforeLabel: "Auditorio",
    afterUrl: IMG("UM2sD2GUl9wDjHpLI1Xy9zN3Xo.jpg"),
    afterLabel: "Salón",
    features: FEATURES,
}

addPropertyControls(VenueShift, {
    eyebrow: { type: ControlType.String, title: "Antetítulo", defaultValue: VenueShift.defaultProps.eyebrow },
    title: { type: ControlType.String, title: "Título", defaultValue: VenueShift.defaultProps.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: VenueShift.defaultProps.lead },
    before: { type: ControlType.ResponsiveImage, title: "Foto 1" },
    beforeUrl: { type: ControlType.String, title: "Foto 1 (URL)", defaultValue: VenueShift.defaultProps.beforeUrl },
    beforeLabel: { type: ControlType.String, title: "Foto 1 · nombre", defaultValue: "Auditorio" },
    after: { type: ControlType.ResponsiveImage, title: "Foto 2" },
    afterUrl: { type: ControlType.String, title: "Foto 2 (URL)", defaultValue: VenueShift.defaultProps.afterUrl },
    afterLabel: { type: ControlType.String, title: "Foto 2 · nombre", defaultValue: "Salón" },
    features: {
        type: ControlType.Array,
        title: "Características",
        defaultValue: FEATURES,
        control: {
            type: ControlType.Object,
            controls: {
                icon: { type: ControlType.String, title: "Ícono (Phosphor)" },
                text: { type: ControlType.String, title: "Texto" },
            },
        },
    },
})
