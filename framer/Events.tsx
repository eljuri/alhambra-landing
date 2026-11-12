// Alhambra Shopping — agenda de eventos
// Escritorio: «cine» con el evento activo y línea de tiempo cronológica que
// avanza sola. Móvil: carrusel horizontal con puntos. Cuenta regresiva al
// próximo evento. Portado de main.js.
import { useEffect, useMemo, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, src, ROOT_CLASS, reduceMotion } from "./Theme.tsx"
import { isCanvas, parseDate, monthShort } from "./Behaviors.tsx"

const EVENTS = [
    { date: "2026-02-13", tag: "Demostración", title: "Nuevo Alhambra 2", meta: "Viernes, 13 de febrero de 2026", imageUrl: IMG("bMHZY91kYoaBm3J81ZhOSSo4NZI.jpg"), linkLabel: "Más información", link: "/eventos?evento=alhambra2", sponsors: "" },
    { date: "2026-02-14", tag: "Taller", title: "Dilo con Flores", meta: "Sábado, 14 de febrero de 2026", imageUrl: IMG("Sy5Mex1hkXOH8fWgo3KqP5ywjg0.png"), linkLabel: "Más información", link: "/eventos?evento=dilo-con-flores", sponsors: "" },
    { date: "2026-07-28T08:30", tag: "", title: "Mid Year Sale", meta: "Martes, 28 de julio de 2026 · 8H30", imageUrl: IMG("9ZYsigPSJhc23fVR91nZnD0Dtc.png"), linkLabel: "Regístrate", link: "/eventos?evento=strong-nation", sponsors: "" },
    { date: "2026-07-30T14:00", tag: "Fitness", title: "Feria Viva!", meta: "Jueves, 30 de julio de 2026 · 2PM", imageUrl: IMG("GDUyFdQmdNCJHE0E1d6iQbMpeBA.webp"), linkLabel: "Regístrate", link: "/eventos?evento=feria-viva", sponsors: `${IMG("AzdMndHYKY3liFiLwpYJi9sBrKc.jpeg")}, ${IMG("04sPCICMpWpd5DB9cm1q846juno.png")}` },
]

const DAY = 86400000
const AUTO = 7000
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

function Sponsors({ list }) {
    if (!list.length) return null
    return (
        <ul className="sponsors" aria-label="Patrocinios">
            {list.map((url, i) => (
                <li key={i}><img src={url} alt={`Patrocinio ${i + 1}`} loading="lazy" /></li>
            ))}
        </ul>
    )
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Events(props) {
    useAlhambraStyles()
    const { moreLabel, moreLink, countdownLabel } = props
    const agendaRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLOListElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)

    // Las fechas dependen del reloj del visitante: se calculan tras montar
    const [now, setNow] = useState<Date | null>(null)
    useEffect(() => setNow(new Date()), [])
    const today = useMemo(() => {
        const t = new Date(now || 0)
        t.setHours(0, 0, 0, 0)
        return t
    }, [now])

    const all = useMemo(
        () =>
            (props.events || []).map((e, i) => {
                const date = parseDate(e.date)
                const past = now ? date < today : false
                return {
                    ...e,
                    key: i,
                    date,
                    img: src(e.image, e.imageUrl),
                    day: pad(date.getDate()),
                    month: monthShort(date),
                    past,
                    soon: now ? date >= today && date.getTime() - today.getTime() < 8 * DAY : false,
                    status: now ? statusOf(date, today) : "",
                    sponsorList: String(e.sponsors || "").split(",").map((s) => s.trim()).filter(Boolean),
                }
            }),
        [props.events, now]
    )

    // Móvil: próximos primero (del más cercano al más lejano), luego los pasados
    const slots = useMemo(() => {
        const up = all.filter((s) => !s.past).sort((a, b) => +a.date - +b.date)
        const past = all.filter((s) => s.past).sort((a, b) => +b.date - +a.date)
        return [...up, ...past]
    }, [all])
    // Escritorio: orden cronológico
    const chrono = useMemo(() => [...all].sort((a, b) => +a.date - +b.date), [all])
    const total = chrono.length
    const passed = chrono.filter((s) => s.past).length

    // Cine: evento activo y avance automático
    const [current, setCurrent] = useState(-1)
    const [prev, setPrev] = useState(-1)
    const elapsed = useRef(0)
    const select = (index: number) => {
        elapsed.current = 0
        setCurrent((c) => {
            if (c !== index) setPrev(c)
            return index
        })
    }
    useEffect(() => {
        if (!now || !total) return
        select(passed < total ? passed : total - 1)
    }, [now, total])

    const setFill = (index: number) => {
        const p = total > 1 ? Math.min((index + elapsed.current / AUTO) / (total - 1), 1) : 1
        trackRef.current?.style.setProperty("--p", p.toFixed(4))
    }
    useEffect(() => setFill(current), [current])

    const currentRef = useRef(current)
    currentRef.current = current
    useEffect(() => {
        const agenda = agendaRef.current
        if (!agenda || isCanvas() || total < 2) return
        const desktop = window.matchMedia("(min-width: 961px)")
        let inView = false, paused = false, last = 0, raf = 0
        const canAuto = () => inView && !paused && desktop.matches && !reduceMotion() && !document.hidden
        const loop = (t: number) => {
            raf = 0
            if (!canAuto()) return
            if (last) elapsed.current += t - last
            last = t
            if (elapsed.current >= AUTO) select((currentRef.current + 1) % total)
            else setFill(currentRef.current)
            raf = requestAnimationFrame(loop)
        }
        const resume = () => {
            if (raf || !canAuto()) return
            last = 0
            raf = requestAnimationFrame(loop)
        }
        const io = new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting
            resume()
            restartSlide()
        }, { threshold: 0.35 })
        io.observe(agenda)
        const enter = () => { paused = true }
        const leaveP = () => { paused = agenda.contains(document.activeElement); resume() }
        const focusIn = () => { paused = true }
        const focusOut = (e: FocusEvent) => {
            if (agenda.contains(e.relatedTarget as Node)) return
            paused = agenda.matches(":hover")
            resume()
        }
        agenda.addEventListener("pointerenter", enter)
        agenda.addEventListener("pointerleave", leaveP)
        agenda.addEventListener("focusin", focusIn)
        agenda.addEventListener("focusout", focusOut)
        document.addEventListener("visibilitychange", resume)
        desktop.addEventListener("change", resume)

        // Móvil: el carrusel también avanza solo
        const list = listRef.current
        let timer = 0 as any
        const canSlide = () => inView && !desktop.matches && !reduceMotion() && !document.hidden
        const slide = () => {
            if (!list || list.children.length < 2) return
            const a = list.children[0] as HTMLElement, b = list.children[1] as HTMLElement
            const step = b.offsetLeft - a.offsetLeft || 1
            const index = Math.round(list.scrollLeft / step)
            const atEnd = index >= list.children.length - 1 || list.scrollLeft + list.clientWidth >= list.scrollWidth - 2
            list.scrollTo({ left: atEnd ? 0 : (index + 1) * step, behavior: "smooth" })
        }
        const restartSlide = () => {
            clearInterval(timer)
            timer = canSlide() ? setInterval(slide, AUTO) : 0
        }
        list?.addEventListener("pointerdown", restartSlide, { passive: true })
        document.addEventListener("visibilitychange", restartSlide)
        desktop.addEventListener("change", restartSlide)

        return () => {
            io.disconnect()
            cancelAnimationFrame(raf)
            clearInterval(timer)
            agenda.removeEventListener("pointerenter", enter)
            agenda.removeEventListener("pointerleave", leaveP)
            agenda.removeEventListener("focusin", focusIn)
            agenda.removeEventListener("focusout", focusOut)
            document.removeEventListener("visibilitychange", resume)
            document.removeEventListener("visibilitychange", restartSlide)
            desktop.removeEventListener("change", resume)
            desktop.removeEventListener("change", restartSlide)
            list?.removeEventListener("pointerdown", restartSlide)
        }
    }, [total])

    // Móvil: puntos que siguen el carrusel
    const [dot, setDot] = useState(0)
    const onListScroll = () => {
        const list = listRef.current
        if (!list || list.children.length < 2) return
        const step = (list.children[1] as HTMLElement).offsetLeft - (list.children[0] as HTMLElement).offsetLeft || 1
        setDot(Math.min(Math.round(list.scrollLeft / step), list.children.length - 1))
    }

    // Cuenta regresiva al siguiente evento que aún no empieza
    const next = useMemo(
        () => (now ? all.filter((s) => s.date > now).sort((a, b) => +a.date - +b.date)[0] : undefined),
        [all, now]
    )
    const [left, setLeft] = useState(0)
    useEffect(() => {
        if (!next) return
        const render = () => setLeft(Math.max(+next.date - Date.now(), 0))
        render()
        const id = setInterval(render, 1000)
        return () => clearInterval(id)
    }, [next])
    const units = [
        [Math.floor(left / DAY), "días"],
        [Math.floor(left / 3600000) % 24, "horas"],
        [Math.floor(left / 60000) % 60, "min"],
        [Math.floor(left / 1000) % 60, "seg"],
    ]

    // El afiche y su fondo se desplazan en sentidos opuestos según el mouse
    const onCinemaMove = (e: React.PointerEvent<HTMLDivElement>) => {
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
        el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
    }
    const onCinemaLeave = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.style.setProperty("--mx", "0")
        e.currentTarget.style.setProperty("--my", "0")
    }

    const todayAt =
        passed === 0
            ? "calc(50% / var(--n) - 32px)"
            : passed === total
              ? "calc(100% - 50% / var(--n) + 32px)"
              : `${(passed / total) * 100}%`

    const onStopsKey = (e: React.KeyboardEvent) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
        e.preventDefault()
        const index = (current + (e.key === "ArrowRight" ? 1 : -1) + total) % total
        select(index)
        const btn = (e.currentTarget as HTMLElement).querySelectorAll("button")[index] as HTMLElement
        btn?.focus()
    }

    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }}>
            <section className="section events" id="inicio" aria-labelledby="events-title">
                <div className="container">
                    <header className="events__head">
                        <h2 className="visually-hidden" id="events-title">Eventos</h2>
                        <div className="countdown" hidden={!next}>
                            <p className="countdown__label">
                                {countdownLabel} · <span>{next?.title}</span>
                            </p>
                            <p className="countdown__clock" aria-hidden="true">
                                {units.map(([v, label]) => (
                                    <span key={label as string}>
                                        <b>{pad(v as number)}</b>
                                        <small>{label}</small>
                                    </span>
                                ))}
                            </p>
                        </div>
                    </header>

                    <div className="agenda is-enhanced" ref={agendaRef}>
                        <div className="cinema" onPointerMove={onCinemaMove} onPointerLeave={onCinemaLeave}>
                            {chrono.map((s, i) => {
                                const cls = [
                                    "cinema__panel",
                                    i === current && "is-active",
                                    i === prev && i !== current && "is-leaving",
                                    s.past && "is-past",
                                    s.soon && "is-soon",
                                ].filter(Boolean).join(" ")
                                const parts = [
                                    <p className="cinema__date" key="d">
                                        <span className="cinema__day">{s.day}</span>
                                        <span className="cinema__month">{`${s.month} ${s.date.getFullYear()}`}</span>
                                    </p>,
                                    s.tag ? <p className="slot__tag" key="t">{s.tag}</p> : null,
                                    <h3 className="slot__title" key="h">{s.title}</h3>,
                                    <p className="slot__meta" key="m">{s.meta}</p>,
                                    s.status ? <p className="slot__status" key="s">{s.status}</p> : null,
                                    s.sponsorList.length ? <Sponsors list={s.sponsorList} key="sp" /> : null,
                                    <a className="btn btn--light" href={s.link} key="a">
                                        {s.linkLabel} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                                    </a>,
                                ].filter(Boolean)
                                return (
                                    <article className={cls} aria-label={s.title} key={s.key} {...((i !== current ? { inert: "" } : {}) as any)}>
                                        <img className="cinema__glow" src={s.img} alt="" />
                                        <div className="cinema__info">
                                            {parts.map((node, d) => (
                                                <div className="cinema__line" key={d}>
                                                    <div className="cinema__lift" style={{ ["--d" as any]: d }}>{node}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="cinema__media">
                                            <img className="cinema__poster" src={s.img} alt={s.title} />
                                        </div>
                                    </article>
                                )
                            })}

                            <div className="timeline">
                                <div className="timeline__nav">
                                    <button type="button" className="timeline__arrow" aria-label="Evento anterior" onClick={() => select((current - 1 + total) % total)}>
                                        <i className="ph ph-arrow-left" aria-hidden="true"></i>
                                    </button>
                                    <p className="timeline__count" aria-hidden="true">
                                        <b>{pad(current + 1)}</b> / <span>{pad(total)}</span>
                                    </p>
                                    <button type="button" className="timeline__arrow" aria-label="Evento siguiente" onClick={() => select((current + 1) % total)}>
                                        <i className="ph ph-arrow-right" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div className="timeline__track" ref={trackRef} style={{ ["--n" as any]: String(total) }}>
                                    <span className="timeline__line"><span className="timeline__fill"></span></span>
                                    <ol className="timeline__stops" onKeyDown={onStopsKey}>
                                        {chrono.map((s, i) => (
                                            <li key={s.key}>
                                                <button
                                                    type="button"
                                                    className={`timeline__stop${s.past ? " is-past" : ""}`}
                                                    aria-current={i === current ? "true" : undefined}
                                                    aria-label={`${s.title}, ${s.day} ${s.month}`}
                                                    onClick={() => select(i)}
                                                >
                                                    <span className="timeline__dot"></span>
                                                    <b className="timeline__when">{`${s.day} ${s.month}`}</b>
                                                    <span className="timeline__name">{s.title}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ol>
                                    {now ? <span className="timeline__today" style={{ ["--today" as any]: todayAt }}>Hoy</span> : null}
                                </div>
                                <div className="timeline__more">
                                    <a className="btn btn--light" href={moreLink} data-magnetic="">
                                        {moreLabel} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <ol className="agenda__list" ref={listRef} onScroll={onListScroll}>
                            {slots.map((s) => (
                                <li className={`slot${s.past ? " is-past" : ""}${s.soon ? " is-soon" : ""}`} key={s.key}>
                                    <article className="slot__card">
                                        <img className="slot__img" src={s.img} alt="" loading="lazy" decoding="async" />
                                        <time className="slot__date" dateTime={s.date.toISOString()}>
                                            <span className="slot__day">{s.day}</span>
                                            <span className="slot__month">{s.month}</span>
                                        </time>
                                        <div className="slot__info">
                                            {s.tag ? <p className="slot__tag">{s.tag}</p> : null}
                                            <h3 className="slot__title">{s.title}</h3>
                                            <p className="slot__meta">{s.meta}</p>
                                            <p className="slot__status">{s.status}</p>
                                            <Sponsors list={s.sponsorList} />
                                        </div>
                                        <a className="slot__link" href={s.link}>
                                            {s.linkLabel} <i className="ph ph-arrow-up-right" aria-hidden="true"></i>
                                        </a>
                                    </article>
                                </li>
                            ))}
                        </ol>
                        {slots.length > 1 ? (
                            <div className="agenda__dots" aria-hidden="true">
                                {slots.map((s, i) => <span key={s.key} className={i === dot ? "is-on" : undefined}></span>)}
                            </div>
                        ) : null}
                    </div>

                    <div className="events__more">
                        <a className="btn btn--dark" href={moreLink}>
                            {moreLabel} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

Events.defaultProps = {
    events: EVENTS,
    moreLabel: "Ver todos los eventos",
    moreLink: "/eventos",
    countdownLabel: "Próximo evento",
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
                image: { type: ControlType.ResponsiveImage, title: "Imagen" },
                imageUrl: { type: ControlType.String, title: "Imagen (URL)", description: "Se usa si no subes una imagen" },
                linkLabel: { type: ControlType.String, title: "Texto botón" },
                link: { type: ControlType.Link, title: "Enlace" },
                sponsors: { type: ControlType.String, title: "Patrocinios", displayTextArea: true, description: "URLs de logos separadas por coma" },
            },
        },
        defaultValue: EVENTS,
    },
    countdownLabel: { type: ControlType.String, title: "Cuenta regresiva", defaultValue: "Próximo evento" },
    moreLabel: { type: ControlType.String, title: "Texto «ver todos»", defaultValue: "Ver todos los eventos" },
    moreLink: { type: ControlType.Link, title: "Enlace «ver todos»", defaultValue: "/eventos" },
})
