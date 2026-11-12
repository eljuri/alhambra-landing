// Alhambra Shopping — «Descubre Alhambra»: grilla de categorías con revelado,
// parallax, inclinación hacia el mouse y cursor «Ver»
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, REPO, src, Split, ROOT_CLASS, useReveal, reduceMotion } from "./Theme.tsx"
import { useMagnetic, useCursor, hasFinePointer, isCanvas } from "./Behaviors.tsx"

const ITEMS = [
    { size: "wide", icon: "handbag", name: "Moda y accesorios", text: "Encuentra marcas, tendencias y estilos para cada ocasión.", imageUrl: IMG("NW4PnMlNLQ7J5N56nNn8QfjlfJI.jpg"), alt: "Traje, zapatos y maletín de una marca de moda", link: "/marcas" },
    { size: "normal", icon: "flower-lotus", name: "Belleza y bienestar", text: "Descubre espacios dedicados al cuidado personal y al bienestar.", imageUrl: IMG("kMac0bPT6bBwHz5CRIqLW6GJ2Y.jpg"), alt: "Tratamiento facial en un espacio de belleza", link: "/marcas" },
    { size: "normal", icon: "lamp", name: "Hogar y decoración", text: "Encuentra inspiración y detalles para tus espacios.", imageUrl: `${REPO}/imagenes/hero/marcas.jpeg`, alt: "Tienda Unity Home, hogar y decoración", link: "/marcas" },
    { size: "normal", icon: "fork-knife", name: "Gastronomía", text: "Disfruta de restaurantes, cafeterías y propuestas para todos los gustos.", imageUrl: `${REPO}/imagenes/hero/comidas.jpeg`, alt: "Propuesta gastronómica de Alhambra Shopping", link: "/restaurantes" },
    { size: "normal", icon: "device-mobile", name: "Tecnología y servicios", text: "Descubre soluciones y servicios para tu día a día.", imageUrl: IMG("x8kZZ5brski3bKyqQPFCBq5PIA.jpeg"), alt: "Taller de relojería, un servicio del centro comercial", link: "/marcas" },
    { size: "band", icon: "confetti", name: "Eventos y experiencias", text: "Vive actividades, encuentros y momentos especiales en Alhambra.", imageUrl: IMG("9ZYsigPSJhc23fVR91nZnD0Dtc.png"), alt: "Actividad en Alhambra Shopping", link: "/#inicio" },
]

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Discover(props) {
    useAlhambraStyles()
    const { title, sub, lead, items, allTitle, allText, allCta, allLink, cursorLabel } = props
    const root = useRef<HTMLDivElement>(null)
    const grid = useRef<HTMLUListElement>(null)

    // El retraso depende de la columna: cada fila entra de izquierda a derecha
    useEffect(() => {
        const list = grid.current
        if (!list) return
        const box = list.getBoundingClientRect()
        Array.from(list.children).forEach((item) => {
            const left = (item.getBoundingClientRect().left - box.left) / (box.width || 1)
            ;(item as HTMLElement).style.setProperty("--delay", `${(left * 0.36).toFixed(2)}s`)
        })
    }, [items])

    useReveal(root)
    useMagnetic(root)
    useCursor(root)

    // Parallax de cada foto dentro de su marco + inclinación hacia el mouse
    useEffect(() => {
        const host = root.current
        if (!host || reduceMotion() || isCanvas()) return
        const frames = Array.from(host.querySelectorAll<HTMLElement>(".discover__frame"))
        const visible = new Set<HTMLElement>()
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement)))
        })
        frames.forEach((f) => io.observe(f))
        let raf = 0
        const tick = () => {
            raf = 0
            const vh = window.innerHeight
            visible.forEach((frame) => {
                const r = frame.getBoundingClientRect()
                const t = (vh / 2 - (r.top + r.height / 2)) / ((vh + r.height) / 2)
                frame.style.setProperty("--py", `${(t * 6).toFixed(2)}%`)
            })
        }
        const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }
        window.addEventListener("scroll", kick, { passive: true })
        window.addEventListener("resize", kick)
        kick()

        const offs: Array<() => void> = []
        if (hasFinePointer()) {
            host.classList.add("has-tilt")
            frames.forEach((frame) => {
                const move = (e: PointerEvent) => {
                    const r = frame.getBoundingClientRect()
                    const px = (e.clientX - r.left) / r.width
                    const py = (e.clientY - r.top) / r.height
                    frame.classList.add("is-tilting")
                    frame.style.setProperty("--ry", `${((px - 0.5) * 7).toFixed(2)}deg`)
                    frame.style.setProperty("--rx", `${((0.5 - py) * 7).toFixed(2)}deg`)
                    frame.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`)
                    frame.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`)
                }
                const leave = () => {
                    frame.classList.remove("is-tilting")
                    frame.style.setProperty("--rx", "0deg")
                    frame.style.setProperty("--ry", "0deg")
                }
                frame.addEventListener("pointermove", move)
                frame.addEventListener("pointerleave", leave)
                offs.push(() => {
                    frame.removeEventListener("pointermove", move)
                    frame.removeEventListener("pointerleave", leave)
                })
            })
        }
        return () => {
            io.disconnect()
            window.removeEventListener("scroll", kick)
            window.removeEventListener("resize", kick)
            offs.forEach((off) => off())
        }
    }, [items])

    // En el lienzo se ve todo ya revelado
    const reveal = isCanvas() ? "" : " reveal"

    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            <section className="section discover" id="descubre" aria-labelledby="discover-title">
                <div className="container">
                    <header className={`discover__head discover__head--center${reveal} reveal--stagger`}>
                        <Split className="discover__title" id="discover-title" text={title} />
                        <p className="discover__sub">{sub}</p>
                        <p className="discover__lead">{lead}</p>
                    </header>

                    <ul className="discover__grid" ref={grid}>
                        {(items || []).map((it, i) => (
                            <li
                                key={i}
                                className={`discover__item${it.size === "wide" ? " discover__item--wide" : ""}${it.size === "band" ? " discover__item--band" : ""}${reveal}`}
                            >
                                <a className="discover__frame" href={it.link} data-cursor={cursorLabel}>
                                    <img src={src(it.image, it.imageUrl)} alt={it.alt || ""} loading="lazy" decoding="async" />
                                    <span className="discover__shade" aria-hidden="true"></span>
                                    <span className="discover__body">
                                        {it.icon ? <i className={`ph ph-${it.icon}`} aria-hidden="true"></i> : null}
                                        <span className="discover__name">{it.name}</span>
                                        <span className="discover__text">{it.text}</span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <a className={`discover__all${reveal}`} href={allLink}>
                        <span>
                            <span className="discover__all-title">{allTitle}</span>
                            <span className="discover__all-text">{allText}</span>
                        </span>
                        <span className="discover__go" data-magnetic="">
                            {allCta} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                        </span>
                    </a>
                </div>
            </section>
        </div>
    )
}

Discover.defaultProps = {
    title: "Descubre Alhambra",
    sub: "Todo lo que buscas, en un solo lugar.",
    lead: "Explora una selección de marcas, sabores, servicios y experiencias que hacen de Alhambra Shopping un lugar para disfrutar, descubrir y compartir.",
    items: ITEMS,
    allTitle: "Descubre todas nuestras marcas",
    allText: "Explora la oferta de Alhambra Shopping y encuentra tu próximo lugar favorito.",
    allCta: "Explorar",
    allLink: "/shopping",
    cursorLabel: "Ver",
}

addPropertyControls(Discover, {
    title: { type: ControlType.String, title: "Título", defaultValue: Discover.defaultProps.title },
    sub: { type: ControlType.String, title: "Subtítulo", defaultValue: Discover.defaultProps.sub },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: Discover.defaultProps.lead },
    items: {
        type: ControlType.Array,
        title: "Categorías",
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Nombre" },
                text: { type: ControlType.String, title: "Texto", displayTextArea: true },
                size: { type: ControlType.Enum, title: "Tamaño", options: ["normal", "wide", "band"], optionTitles: ["Normal", "Ancha", "Franja completa"] },
                icon: { type: ControlType.String, title: "Ícono", description: "Nombre Phosphor, p. ej. handbag" },
                image: { type: ControlType.ResponsiveImage, title: "Imagen" },
                imageUrl: { type: ControlType.String, title: "Imagen (URL)" },
                alt: { type: ControlType.String, title: "Texto alt" },
                link: { type: ControlType.Link, title: "Enlace" },
            },
        },
        defaultValue: ITEMS,
    },
    allTitle: { type: ControlType.String, title: "Bloque final · título", defaultValue: Discover.defaultProps.allTitle },
    allText: { type: ControlType.String, title: "Bloque final · texto", displayTextArea: true, defaultValue: Discover.defaultProps.allText },
    allCta: { type: ControlType.String, title: "Bloque final · botón", defaultValue: "Explorar" },
    allLink: { type: ControlType.Link, title: "Bloque final · enlace", defaultValue: "/shopping" },
    cursorLabel: { type: ControlType.String, title: "Texto del cursor", defaultValue: "Ver" },
})
