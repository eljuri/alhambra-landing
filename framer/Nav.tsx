// Alhambra Shopping — navegación fija con fondo al hacer scroll y menú móvil
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, src } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"

const LINKS = [
    { label: "Marcas", link: "/marcas" },
    { label: "Restaurantes", link: "/restaurantes" },
    { label: "Eventos", link: "/#inicio" },
    { label: "Auditorio", link: "/salonauditorio" },
]

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Nav(props) {
    useAlhambraStyles()
    const { logo, homeLink, links, animateIntro } = props
    const nav = useRef<HTMLElement>(null)
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [path, setPath] = useState("")
    const canvas = isCanvas()

    // Marca la página actual (se lee tras montar para no romper el render del servidor)
    useEffect(() => setPath(location.pathname.replace(/\/$/, "")), [])

    useEffect(() => {
        if (canvas) return
        const onScroll = () => {
            setScrolled(window.scrollY > 24)
            const max = document.documentElement.scrollHeight - window.innerHeight
            nav.current?.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : "0")
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        const mq = window.matchMedia("(min-width: 901px)")
        const onMq = (e: MediaQueryListEvent) => e.matches && setOpen(false)
        mq.addEventListener("change", onMq)
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
        document.addEventListener("keydown", onKey)
        return () => {
            window.removeEventListener("scroll", onScroll)
            mq.removeEventListener("change", onMq)
            document.removeEventListener("keydown", onKey)
        }
    }, [])

    useEffect(() => {
        if (canvas) return
        document.body.classList.toggle("alh-menu-open", open)
        return () => document.body.classList.remove("alh-menu-open")
    }, [open])

    const cls = ["nav", scrolled && "is-scrolled", open && "is-open"].filter(Boolean).join(" ")
    // En el lienzo de Framer el nav no es fijo: se ve como una barra sobre fondo oscuro
    const canvasStyle = canvas ? { position: "relative" as const, background: "var(--graphite)" } : undefined

    return (
        <div className={`alh js${animateIntro ? " page-home" : ""}`} style={{ width: "100%", height: canvas ? "auto" : 0 }}>
            <header className={cls} ref={nav} style={canvasStyle}>
                <span className="nav__progress" aria-hidden="true"></span>
                <div className="nav__inner container">
                    <a className="nav__brand" href={homeLink} aria-label="Alhambra Shopping, inicio">
                        <img src={src(logo, IMG("HcVAk9C7PnJQR0x6m7aF7pGBwI.png"))} alt="Alhambra" width={232} height={324} />
                    </a>
                    <button
                        className="nav__toggle"
                        type="button"
                        aria-expanded={open}
                        aria-controls="nav-menu"
                        aria-label={open ? "Cerrar menú" : "Abrir menú"}
                        onClick={() => setOpen(!open)}
                    >
                        <i className={open ? "ph ph-x" : "ph ph-list"} aria-hidden="true"></i>
                    </button>
                    <nav className="nav__menu" id="nav-menu" aria-label="Principal" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
                        <ul className="nav__links">
                            {(links || []).map((l, i) => (
                                <li key={i}><a href={l.link} aria-current={path && l.link === path ? "page" : undefined}>{l.label}</a></li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    )
}

Nav.defaultProps = { homeLink: "/", links: LINKS, animateIntro: true }

addPropertyControls(Nav, {
    logo: { type: ControlType.ResponsiveImage, title: "Logo" },
    homeLink: { type: ControlType.Link, title: "Enlace logo" },
    links: {
        type: ControlType.Array,
        title: "Enlaces",
        control: {
            type: ControlType.Object,
            controls: {
                label: { type: ControlType.String, title: "Texto" },
                link: { type: ControlType.Link, title: "Enlace" },
            },
        },
        defaultValue: LINKS,
    },
    animateIntro: { type: ControlType.Boolean, title: "Animar entrada", defaultValue: true },
})
