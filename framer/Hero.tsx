// Alhambra Shopping — hero con video, grano y entrada por palabras
import { useEffect, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, REPO, CDN, src, Split, ROOT_CLASS, reduceMotion } from "./Theme.tsx"
import { hasFinePointer, isCanvas } from "./Behaviors.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Hero(props) {
    useAlhambraStyles()
    const { video, videoUrl, poster, posterUrl, name, title, lead, cueText, cueLink } = props
    const hero = useRef<HTMLElement>(null)
    const film = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const el = hero.current
        if (!el || isCanvas()) return
        if (reduceMotion()) {
            film.current?.pause()
            return
        }
        // --hero-p: 0 → 1 mientras el hero sale de pantalla
        let raf = 0
        const tick = () => {
            raf = 0
            const p = Math.min(Math.max(window.scrollY / el.offsetHeight, 0), 1)
            el.style.setProperty("--hero-p", p.toFixed(4))
        }
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick) }
        window.addEventListener("scroll", onScroll, { passive: true })
        tick()

        // El texto y el video siguen al mouse en sentidos opuestos
        const move = (e: PointerEvent) => {
            el.style.setProperty("--hx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
            el.style.setProperty("--hy", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
        }
        const leave = () => {
            el.style.setProperty("--hx", "0")
            el.style.setProperty("--hy", "0")
        }
        if (hasFinePointer()) {
            el.addEventListener("pointermove", move)
            el.addEventListener("pointerleave", leave)
        }
        return () => {
            window.removeEventListener("scroll", onScroll)
            el.removeEventListener("pointermove", move)
            el.removeEventListener("pointerleave", leave)
        }
    }, [])

    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }}>
            <section className="hero hero--film" aria-labelledby="hero-name" ref={hero}>
                <video className="hero__video" ref={film} autoPlay muted loop playsInline preload="metadata" src={video || videoUrl} poster={src(poster, posterUrl) || undefined} />
                <div className="hero__shade" aria-hidden="true"></div>
                <div className="hero__grain" aria-hidden="true"></div>
                <div className="hero__inner container">
                    <div className="hero__content">
                        <h1 className="hero__name" id="hero-name">{name}</h1>
                        <Split as="h2" className="hero__title" text={title} />
                        <p className="hero__lead intro">{lead}</p>
                    </div>
                </div>
                <a className="hero__cue" href={cueLink} aria-label="Ir a próximos eventos">
                    <span className="hero__cue-text" aria-hidden="true">{cueText}</span>
                    <span className="hero__cue-line" aria-hidden="true"></span>
                </a>
            </section>
        </div>
    )
}

Hero.defaultProps = {
    videoUrl: `${REPO}/video/hero2.mp4`,
    // Primer cuadro del video: se ve mientras el video carga
    posterUrl: `${CDN}/video/hero2-poster.jpg`,
    name: "Alhambra",
    title: "Vive lo extraordinario",
    lead: "Mucho más que compras: gastronomía, entretenimiento y experiencias únicas que hacen de cada visita un momento especial.",
    cueText: "Desliza",
    cueLink: "#inicio",
}

addPropertyControls(Hero, {
    video: { type: ControlType.File, title: "Video", allowedFileTypes: ["mp4", "webm", "mov"] },
    videoUrl: { type: ControlType.String, title: "Video (URL)", defaultValue: Hero.defaultProps.videoUrl },
    poster: { type: ControlType.ResponsiveImage, title: "Portada", description: "Se ve mientras carga el video" },
    posterUrl: { type: ControlType.String, title: "Portada (URL)", defaultValue: Hero.defaultProps.posterUrl },
    name: { type: ControlType.String, title: "Nombre", defaultValue: Hero.defaultProps.name },
    title: { type: ControlType.String, title: "Título", defaultValue: Hero.defaultProps.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: Hero.defaultProps.lead },
    cueText: { type: ControlType.String, title: "Indicador", defaultValue: Hero.defaultProps.cueText },
    cueLink: { type: ControlType.Link, title: "Enlace indicador", defaultValue: Hero.defaultProps.cueLink },
})
