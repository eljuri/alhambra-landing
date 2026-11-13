// Alhambra Shopping — agenda de eventos (inicio)
// Composición centrada, como el resto de la página: encabezado centrado, un
// evento destacado (el próximo o, si no hay, el último) con su foto a lo
// ancho con el texto centrado encima (como el hero), y una fila de tarjetas
// con los demás.
// Botones como el de «Mantente conectado» y cursor «Ver» como en «Descubre».
import { useEffect, useMemo, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, src, Split, ROOT_CLASS, useReveal, reduceMotion } from "./Theme.tsx"
import { isCanvas, parseDate, monthShort, useCursor } from "./Behaviors.tsx"
import { useCmsEvents } from "./EventsCms.tsx"
import { Btn } from "./Button.tsx"

const EVENTS = [
    { date: "2026-02-13", tag: "Demostración", title: "Nuevo Alhambra 2", meta: "Viernes, 13 de febrero de 2026", text: "", imageUrl: IMG("bMHZY91kYoaBm3J81ZhOSSo4NZI.jpg"), linkLabel: "Más información", link: "/eventos?evento=alhambra2", sponsors: "" },
    { date: "2026-02-14", tag: "Taller", title: "Dilo con Flores", meta: "Sábado, 14 de febrero de 2026", text: "", imageUrl: IMG("Sy5Mex1hkXOH8fWgo3KqP5ywjg0.png"), linkLabel: "Más información", link: "/eventos?evento=dilo-con-flores", sponsors: "" },
    { date: "2026-07-28T08:30", tag: "", title: "Mid Year Sale", meta: "Martes, 28 de julio de 2026 · 8H30", text: "", imageUrl: IMG("9ZYsigPSJhc23fVR91nZnD0Dtc.png"), linkLabel: "Regístrate", link: "/eventos?evento=strong-nation", sponsors: "" },
    { date: "2026-07-30T14:00", tag: "Fitness", title: "Feria Viva!", meta: "Jueves, 30 de julio de 2026 · 2PM", text: "", imageUrl: IMG("GDUyFdQmdNCJHE0E1d6iQbMpeBA.webp"), linkLabel: "Regístrate", link: "/eventos?evento=feria-viva", sponsors: `${IMG("AzdMndHYKY3liFiLwpYJi9sBrKc.jpeg")}, ${IMG("04sPCICMpWpd5DB9cm1q846juno.png")}` },
]

const DAY = 86400000
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
const pad = (n: number) => String(n).padStart(2, "0")

const statusOf = (date: Date, today: Date) => {
    const day = new Date(date)
    day.setHours(0, 0, 0, 0)
    const diff = Math.round((day.getTime() - today.getTime()) / DAY)
    if (diff < 0) return "Finalizado"
    if (diff === 0) return "Hoy"
    if (diff === 1) return "Mañana"
    return `En ${diff} días`
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
// Del CMS (mismo formato que la agenda) al formato de esta sección
const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
const fromCms = (e: any) => {
    if (!("slug" in e)) return e
    const d = parseDate(e.date)
    const day = `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`
    return {
        date: e.date, tag: e.tag, title: e.title, text: "",
        meta: e.time ? `${day} · ${e.time}` : day,
        imageUrl: e.imageUrl, sponsors: e.sponsors,
        linkLabel: e.linkLabel || (e.register ? "Regístrate" : "Más información"),
        link: `/eventos?evento=${encodeURIComponent(e.slug)}`,
    }
}

export default function Events(props) {
    useAlhambraStyles()
    const {
        title, sub, lead, emptySub, emptyText, emptyCta, emptyLink,
        moreLabel, moreLink, featuredLabel, lastLabel, pastCta, sponsorsLabel, cursorLabel, limit,
    } = props
    const events = useCmsEvents(props.events || []) as any[]
    const root = useRef<HTMLDivElement>(null)
    useReveal(root)
    useCursor(root)

    // Las fechas dependen del reloj del visitante: se calculan tras montar
    const [now, setNow] = useState<Date | null>(null)
    useEffect(() => setNow(new Date()), [])

    const { featured, others, hasUpcoming } = useMemo(() => {
        const today = new Date(now || 0)
        today.setHours(0, 0, 0, 0)
        const all = events.map(fromCms).map((e, i) => {
            const date = parseDate(e.date)
            const isPast = now ? date < today : false
            return {
                ...e,
                key: i,
                date,
                img: src(e.image, e.imageUrl),
                day: pad(date.getDate()),
                month: monthShort(date),
                monthLong: MONTHS[date.getMonth()],
                year: date.getFullYear(),
                past: isPast,
                status: now ? statusOf(date, today) : "",
                sponsorList: String(e.sponsors || "").split(",").map((s) => s.trim()).filter(Boolean),
            }
        })
        const up = all.filter((s) => !s.past).sort((a, b) => +a.date - +b.date)
        const gone = all.filter((s) => s.past).sort((a, b) => +b.date - +a.date)
        const feat = up[0] || gone[0]
        const rest = [...up, ...gone].filter((s) => s !== feat).slice(0, Math.max(1, Number(limit) || 3))
        return { featured: feat, others: rest, hasUpcoming: !now || up.length > 0 }
    }, [events, now, limit])

    // Cuenta regresiva discreta al evento destacado, si aún no empieza
    const [left, setLeft] = useState(0)
    useEffect(() => {
        if (!now || !featured || featured.date <= now) { setLeft(0); return }
        const render = () => setLeft(Math.max(+featured.date - Date.now(), 0))
        render()
        const id = setInterval(render, 1000)
        return () => clearInterval(id)
    }, [featured, now])
    const countdown = left > 0
        ? [
            [Math.floor(left / DAY), "días"],
            [Math.floor(left / 3600000) % 24, "horas"],
            [Math.floor(left / 60000) % 60, "min"],
        ]
        : null

    // Parallax: la foto destacada se desplaza más lento que la página
    const featRef = useRef<HTMLElement>(null)
    useEffect(() => {
        const el = featRef.current
        if (!el || reduceMotion() || isCanvas()) return
        let raf = 0
        const tick = () => {
            raf = 0
            const r = el.getBoundingClientRect()
            const vh = window.innerHeight
            if (r.bottom < 0 || r.top > vh) return
            const t = (vh / 2 - (r.top + r.height / 2)) / ((vh + r.height) / 2)
            el.style.setProperty("--py", `${(t * 7).toFixed(2)}%`)
        }
        const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }
        window.addEventListener("scroll", kick, { passive: true })
        window.addEventListener("resize", kick)
        kick()
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("scroll", kick)
            window.removeEventListener("resize", kick)
        }
    }, [featured])

    const reveal = isCanvas() ? "" : " reveal"

    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            <section className="section events" id="inicio" aria-labelledby="events-title">
                <div className="container">
                    <header className={`discover__head discover__head--center events__head${reveal} reveal--stagger`}>
                        <Split className="discover__title" id="events-title" text={title} />
                        <p className="discover__sub">{hasUpcoming ? sub : emptySub}</p>
                        <p className="discover__lead">{hasUpcoming ? lead : emptyText}</p>
                    </header>

                    {featured ? (
                        <article className={`evfeat${featured.past ? " is-past" : ""}${reveal}`} aria-labelledby="evfeat-title" ref={featRef}>
                            <a className="evfeat__media" href={featured.link} tabIndex={-1} aria-hidden="true" data-cursor={cursorLabel}>
                                <img src={featured.img} alt="" decoding="async" />
                                <span className="evfeat__shade"></span>
                                <span className="evfeat__grain"></span>
                            </a>
                            <div className="evfeat__body">
                                <p className="evfeat__kicker">
                                    {featured.past ? lastLabel : featuredLabel}
                                    {featured.tag ? <span>{featured.tag}</span> : null}
                                </p>
                                <time className="evfeat__date" dateTime={featured.date.toISOString()}>
                                    <span className="evfeat__day">{featured.day}</span>
                                    <span className="evfeat__month">{`${featured.monthLong} ${featured.year}`}</span>
                                </time>
                                <h3 className="evfeat__title" id="evfeat-title">{featured.title}</h3>
                                <p className="evfeat__meta">{featured.meta}</p>
                                {featured.text ? <p className="evfeat__text">{featured.text}</p> : null}
                                {countdown ? (
                                    <p className="evfeat__count" aria-label={`Faltan ${countdown.map(([v, u]) => `${v} ${u}`).join(", ")}`}>
                                        {countdown.map(([v, u]) => (
                                            <span key={u as string}>
                                                <b>{pad(v as number)}</b>
                                                <small>{u}</small>
                                            </span>
                                        ))}
                                    </p>
                                ) : null}
                                <Btn variant="light" className="evfeat__cta" href={featured.link}>
                                    {featured.past ? pastCta : featured.linkLabel}
                                </Btn>
                                {featured.sponsorList.length ? (
                                    <div className="evfeat__sponsors">
                                        <p>{sponsorsLabel}</p>
                                        <ul>
                                            {featured.sponsorList.map((url, i) => (
                                                <li key={i}><img src={url} alt={`Patrocinio ${i + 1}`} loading="lazy" /></li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </div>
                        </article>
                    ) : null}

                    {others.length ? (
                        <ul className="evcards" style={{ ["--cols" as any]: String(Math.min(others.length, 3)) }}>
                            {/* Clave por posición: las tarjetas no cambian de nodo cuando se conoce la fecha y el revelado sigue funcionando */}
                            {others.map((s, i) => (
                                <li className={`evcard${s.past ? " is-past" : ""}${reveal}`} key={i} style={{ ["--delay" as any]: `${(i * 0.12).toFixed(2)}s` }}>
                                    <a className="evcard__link" href={s.link}>
                                        <span className="evcard__media" data-cursor={cursorLabel}>
                                            <img src={s.img} alt="" loading="lazy" decoding="async" />
                                        </span>
                                        <time className="evcard__date" dateTime={s.date.toISOString()}>
                                            {`${s.day} ${s.month} ${s.year}`}
                                        </time>
                                        <span className="evcard__title">{s.title}</span>
                                        <span className="evcard__status">{s.past ? s.tag || s.status : s.status}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <div className={`events__actions${reveal}`}>
                        <Btn variant="line" href={moreLink}>{moreLabel}</Btn>
                        {!hasUpcoming ? (
                            <Btn variant="line" href={emptyLink}>{emptyCta}</Btn>
                        ) : null}
                    </div>
                </div>
            </section>
        </div>
    )
}

Events.defaultProps = {
    events: EVENTS,
    title: "Próximamente",
    sub: "Lo que viene en Alhambra.",
    lead: "Encuentros, talleres y celebraciones para vivir el centro de otra manera.",
    emptySub: "Nuevas experiencias, muy pronto.",
    emptyText: "Estamos preparando la próxima agenda. Suscríbete y entérate antes que nadie.",
    emptyCta: "Recibir novedades",
    emptyLink: "#suscripcion",
    featuredLabel: "Próximo evento",
    lastLabel: "Lo último en Alhambra",
    pastCta: "Ver el evento",
    sponsorsLabel: "Con el apoyo de",
    cursorLabel: "Ver",
    moreLabel: "Ver toda la agenda",
    moreLink: "/eventos",
    limit: 3,
}

addPropertyControls(Events, {
    events: {
        type: ControlType.Array,
        title: "Eventos",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Título" },
                date: { type: ControlType.String, title: "Fecha", placeholder: "2026-07-28T08:30", description: "AAAA-MM-DD o AAAA-MM-DDTHH:MM" },
                tag: { type: ControlType.String, title: "Etiqueta" },
                meta: { type: ControlType.String, title: "Fecha legible" },
                text: { type: ControlType.String, title: "Descripción", displayTextArea: true, description: "Se muestra cuando el evento es el destacado" },
                image: { type: ControlType.ResponsiveImage, title: "Imagen" },
                imageUrl: { type: ControlType.String, title: "Imagen (URL)", description: "Se usa si no subes una imagen" },
                linkLabel: { type: ControlType.String, title: "Texto botón" },
                link: { type: ControlType.Link, title: "Enlace" },
                sponsors: { type: ControlType.String, title: "Patrocinios", displayTextArea: true, description: "URLs de logos separadas por coma" },
            },
        },
        defaultValue: EVENTS,
    },
    title: { type: ControlType.String, title: "Título", defaultValue: Events.defaultProps.title },
    sub: { type: ControlType.String, title: "Subtítulo", defaultValue: Events.defaultProps.sub },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: Events.defaultProps.lead },
    emptySub: { type: ControlType.String, title: "Sin próximos · subtítulo", defaultValue: Events.defaultProps.emptySub },
    emptyText: { type: ControlType.String, title: "Sin próximos · texto", displayTextArea: true, defaultValue: Events.defaultProps.emptyText },
    emptyCta: { type: ControlType.String, title: "Sin próximos · enlace (texto)", defaultValue: Events.defaultProps.emptyCta },
    emptyLink: { type: ControlType.Link, title: "Sin próximos · enlace", defaultValue: Events.defaultProps.emptyLink },
    featuredLabel: { type: ControlType.String, title: "Rótulo destacado", defaultValue: Events.defaultProps.featuredLabel },
    lastLabel: { type: ControlType.String, title: "Rótulo último", defaultValue: Events.defaultProps.lastLabel },
    pastCta: { type: ControlType.String, title: "Botón si ya pasó", defaultValue: Events.defaultProps.pastCta },
    sponsorsLabel: { type: ControlType.String, title: "Rótulo patrocinios", defaultValue: Events.defaultProps.sponsorsLabel },
    cursorLabel: { type: ControlType.String, title: "Texto del cursor", defaultValue: "Ver" },
    limit: { type: ControlType.Number, title: "Tarjetas máximas", min: 1, max: 9, step: 1, defaultValue: 3 },
    moreLabel: { type: ControlType.String, title: "Texto «ver todos»", defaultValue: Events.defaultProps.moreLabel },
    moreLink: { type: ControlType.Link, title: "Enlace «ver todos»", defaultValue: "/eventos" },
})
