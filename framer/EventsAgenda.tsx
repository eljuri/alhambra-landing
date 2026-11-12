// Alhambra Shopping — página /eventos: próximo evento destacado con cuenta
// regresiva, agenda por meses (próximos / pasados / todos) y panel de detalle
// con registro, «Agregar al calendario» (.ics) y compartir.
// Cada evento tiene enlace propio: /eventos?evento=<slug> abre su panel.
// No hay backend: el registro valida pero no afirma que se envió.
import { useEffect, useMemo, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, Split, ROOT_CLASS, useReveal } from "./Theme.tsx"
import { isCanvas, parseDate } from "./Behaviors.tsx"

const EVENTS = [
    {
        slug: "feria-viva", date: "2026-07-30T14:00", time: "14h00", tag: "Salud", title: "Feria Viva!", place: "Alhambra Shopping",
        summary: "Ven y disfruta de un evento dedicado a la salud.",
        body: "Ven y disfruta de un evento dedicado a la salud.",
        imageUrl: IMG("GDUyFdQmdNCJHE0E1d6iQbMpeBA.webp"), extraUrl: IMG("h9EzzYWipNBmiGoSw4tlPOUJEnM.jpg"),
        sponsors: `${IMG("AzdMndHYKY3liFiLwpYJi9sBrKc.jpeg")}, ${IMG("04sPCICMpWpd5DB9cm1q846juno.png")}`,
        register: true, free: false,
    },
    {
        slug: "strong-nation", date: "2026-07-28T08:30", time: "08h30", tag: "Fitness", title: "Mid Year Sale", place: "Rooftop de Alhambra Shopping",
        summary: "Entrena con nosotros en el evento Wellness Strong Nation.",
        body: "¡Vive un febrero activo con nuestro evento Wellness Strong Nation!\n\nTe invitamos a entrenar con nosotros este sábado 21 de febrero en el rooftop de Alhambra Shopping.\n\nAcompáñanos en esta experiencia llena de energía.",
        imageUrl: IMG("9ZYsigPSJhc23fVR91nZnD0Dtc.png"), extraUrl: "",
        sponsors: `${IMG("TY6NgfoGY6Si8icplNMRtfrukFY.jpeg")}, ${IMG("AzdMndHYKY3liFiLwpYJi9sBrKc.jpeg")}`,
        register: true, free: false,
    },
    {
        slug: "dilo-con-flores", date: "2026-02-14T12:00", time: "Desde las 12h00", tag: "San Valentín", title: "Dilo con Flores", place: "Planta baja",
        summary: "Pasa por nuestro carrito, tómate una foto y llévate una rosa.",
        body: "Algunas historias empiezan con una rosa. Pasa por nuestro carrito, tómate una foto y llévate una rosa para ti o para alguien especial este 14 de febrero, a partir de las 12h00, en Alhambra Shopping.\n\n¡Te esperamos!",
        imageUrl: IMG("Sy5Mex1hkXOH8fWgo3KqP5ywjg0.png"), extraUrl: "", sponsors: "",
        register: false, free: true,
    },
    {
        slug: "alhambra2", date: "2026-02-13", time: "", tag: "Novedades", title: "Nuevo Alhambra 2", place: "Calle Celeste Blacio de Rendón",
        summary: "Sesenta oficinas con vista a los ríos Daule y Babahoyo.",
        body: "Ubicado en la calle Celeste Blacio de Rendón, presentamos Alhambra 2: un edificio de sesenta oficinas con vista hacia los ríos Daule y Babahoyo y acceso al rooftop de Alhambra.\n\nEl nuevo edificio cuenta con seis pisos de parqueos que extienden a cuatrocientos la oferta de espacios.",
        imageUrl: IMG("bMHZY91kYoaBm3J81ZhOSSo4NZI.jpg"), extraUrl: "", sponsors: "",
        register: false, free: false,
    },
    {
        slug: "musica-en-vivo", date: "2026-02-12T18:00", time: "18h00", tag: "Música", title: "Música en vivo", place: "Planta baja",
        summary: "San Valentín se vive en Alhambra con música en vivo.",
        body: "Este 12 de febrero, San Valentín se vive en Alhambra con música en vivo y una tarde ambientada para compartir con quienes más quieres.\n\n¡Te esperamos! Ven a vivir esta experiencia con nosotros.",
        imageUrl: IMG("wTM1pdEVNAYc8p0YuVKj9a3Fjw.png"), extraUrl: "", sponsors: "",
        register: true, free: false,
    },
]

const DAY = 86400000
const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const pad = (n: number) => String(n).padStart(2, "0")
const sized = (url: string, w: number) => (!url || url.includes("?") ? url : `${url}?scale-down-to=${w}`)
const hasTime = (value: string) => String(value).includes("T")

const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("es-EC", opts).format(d)
const longDate = (d: Date) => {
    const s = fmt(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    return s.charAt(0).toUpperCase() + s.slice(1)
}
const monthTitle = (d: Date) => {
    const s = fmt(d, { month: "long", year: "numeric" })
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const statusOf = (date: Date, today: Date) => {
    const day = new Date(date)
    day.setHours(0, 0, 0, 0)
    const diff = Math.round((day.getTime() - today.getTime()) / DAY)
    if (diff < 0) return "Finalizado"
    if (diff === 0) return "Hoy"
    if (diff === 1) return "Mañana"
    return `En ${diff} días`
}

// Archivo .ics para «Agregar al calendario» (sin servicios externos)
const icsStamp = (d: Date) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
const icsDay = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
const icsText = (s: string) => String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1")
// Las horas de la agenda son de Ecuador (UTC−5, sin horario de verano)
const ecuadorTime = (value: string) => {
    const [d, t = "00:00"] = String(value).split("T")
    const [y, m, day] = d.split("-").map(Number)
    const [h, min] = t.split(":").map(Number)
    return new Date(Date.UTC(y, m - 1, day, h + 5, min || 0))
}
function downloadIcs(ev: any, url: string) {
    const start: Date = ev.timed ? ecuadorTime(ev.date) : ev.when
    const lines = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Alhambra Shopping//Eventos//ES", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
        `UID:${ev.slug}-${icsDay(start)}@alhambrashopping.com`,
        `DTSTAMP:${icsStamp(new Date())}`,
    ]
    if (ev.timed) {
        lines.push(`DTSTART:${icsStamp(start)}`, `DTEND:${icsStamp(new Date(start.getTime() + 2 * 3600000))}`)
    } else {
        lines.push(`DTSTART;VALUE=DATE:${icsDay(start)}`, `DTEND;VALUE=DATE:${icsDay(new Date(start.getTime() + DAY))}`)
    }
    lines.push(
        `SUMMARY:${icsText(ev.title)}`,
        `DESCRIPTION:${icsText(`${ev.summary}\n${url}`)}`,
        `LOCATION:${icsText(`${ev.place}, Vía a Samborondón y Celeste Blacio de Rendón`)}`,
        `URL:${url}`,
        "END:VEVENT", "END:VCALENDAR"
    )
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${ev.slug}.ics`
    document.body.append(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

const eventUrl = (slug: string) =>
    typeof location === "undefined" ? "" : `${location.origin}${location.pathname}?evento=${encodeURIComponent(slug)}`

function Sponsors({ list }: { list: string[] }) {
    if (!list.length) return null
    return (
        <ul className="sponsors" aria-label="Con el apoyo de">
            {list.map((url, i) => (
                <li key={i}><img src={url} alt={`Patrocinio ${i + 1}`} loading="lazy" /></li>
            ))}
        </ul>
    )
}

function Countdown({ to, now }: { to: Date; now: Date }) {
    let left = Math.max(0, to.getTime() - now.getTime())
    const days = Math.floor(left / DAY)
    left -= days * DAY
    const parts = [
        [days, days === 1 ? "día" : "días"],
        [Math.floor(left / 3600000), "horas"],
        [Math.floor((left % 3600000) / 60000), "min"],
        [Math.floor((left % 60000) / 1000), "seg"],
    ]
    return (
        <div className="ev-clock" role="timer" aria-label={`Faltan ${days} días`}>
            {parts.map(([n, label], i) => (
                <span key={i}><b>{pad(n as number)}</b><small>{label}</small></span>
            ))}
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function EventsAgenda(props) {
    useAlhambraStyles()
    const { title, lead, emptyTitle, emptyText, emptyCta, emptyLink, registerNote, consent, msgMissing, msgOk, today: todayProp } = props
    const root = useRef<HTMLDivElement>(null)
    const dialog = useRef<HTMLDialogElement>(null)
    const form = useRef<HTMLFormElement>(null)
    useReveal(root)

    // Reloj del visitante (se fija tras montar). ?hoy=AAAA-MM-DD o la
    // propiedad «today» simulan otra fecha para revisar la página.
    const [now, setNow] = useState<Date | null>(null)
    const offset = useRef(0)
    useEffect(() => {
        const forced = new URLSearchParams(location.search).get("hoy") || todayProp
        if (forced) offset.current = parseDate(forced).getTime() - Date.now()
        const tick = () => setNow(new Date(Date.now() + offset.current))
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [todayProp])
    const dayKey = now ? `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}` : ""
    const today = useMemo(() => {
        const t = new Date(now || 0)
        t.setHours(0, 0, 0, 0)
        return t
    }, [dayKey])

    const all = useMemo(
        () =>
            (props.events || []).map((e) => {
                const when = parseDate(e.date)
                const past = now ? when < today : false
                return {
                    ...e,
                    when,
                    timed: hasTime(e.date),
                    past,
                    status: now ? statusOf(when, today) : "",
                    soon: now ? !past && when.getTime() - today.getTime() < 8 * DAY : false,
                    sponsorList: String(e.sponsors || "").split(",").map((s) => s.trim()).filter(Boolean),
                }
            }),
        [props.events, dayKey]
    )
    const upcoming = useMemo(() => all.filter((e) => !e.past).sort((a, b) => +a.when - +b.when), [all])
    const past = useMemo(() => all.filter((e) => e.past).sort((a, b) => +b.when - +a.when), [all])
    const next = upcoming[0]

    // Filtro de la agenda: si no hay próximos, arranca en «Pasados»
    const [filter, setFilter] = useState<"proximos" | "pasados" | "todos">("proximos")
    const picked = useRef(false)
    useEffect(() => {
        if (now && !picked.current) setFilter(upcoming.length ? "proximos" : "pasados")
    }, [Boolean(now), upcoming.length])
    const choose = (f: typeof filter) => {
        picked.current = true
        setFilter(f)
    }
    const shown = filter === "proximos" ? upcoming : filter === "pasados" ? past : [...upcoming, ...past]
    const groups = useMemo(() => {
        const out: { label: string; items: typeof shown }[] = []
        shown.forEach((e) => {
            const label = monthTitle(e.when)
            const last = out[out.length - 1]
            if (last && last.label === label) last.items.push(e)
            else out.push({ label, items: [e] })
        })
        return out
    }, [shown])

    // Panel de detalle
    const [openSlug, setOpenSlug] = useState("")
    const [view, setView] = useState<"detalle" | "registro">("detalle")
    const [invalid, setInvalid] = useState<Record<string, boolean>>({})
    const [notice, setNotice] = useState({ text: "", ok: false })
    const [toast, setToast] = useState({ text: "", visible: false })
    const toastTimer = useRef<any>(0)
    const active = all.find((e) => e.slug === openSlug)

    const showToast = (text: string) => {
        clearTimeout(toastTimer.current)
        setToast({ text, visible: false })
        requestAnimationFrame(() => {
            setToast({ text, visible: true })
            toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3200)
        })
    }

    const setParam = (slug: string) => {
        const url = new URL(location.href)
        if (slug) url.searchParams.set("evento", slug)
        else url.searchParams.delete("evento")
        history.replaceState(history.state, "", url)
    }

    const openEvent = (slug: string, mode: "detalle" | "registro" = "detalle") => {
        setOpenSlug(slug)
        setView(mode)
        setInvalid({})
        setNotice({ text: "", ok: false })
        setParam(slug)
        const d = dialog.current
        if (d && !d.open) {
            d.showModal()
            document.documentElement.style.overflow = "hidden"
        }
        d?.querySelector(".ev-panel__scroll")?.scrollTo(0, 0)
    }
    const closeEvent = () => dialog.current?.close()
    const onClosed = () => {
        document.documentElement.style.removeProperty("overflow")
        setParam("")
        setOpenSlug("")
    }

    // Enlace directo: /eventos?evento=<slug>
    useEffect(() => {
        if (isCanvas()) return
        const slug = new URLSearchParams(location.search).get("evento")
        if (slug && (props.events || []).some((e) => e.slug === slug)) openEvent(slug)
    }, [])

    const share = async (ev: any) => {
        const url = eventUrl(ev.slug)
        if ((navigator as any).share) {
            try {
                await (navigator as any).share({ title: ev.title, text: ev.summary, url })
            } catch {}
            return
        }
        try {
            await navigator.clipboard.writeText(url)
            showToast("Enlace copiado")
        } catch {
            showToast(url)
        }
    }

    // Registro
    const fieldsOf = () => Array.from(form.current?.querySelectorAll<HTMLInputElement>("input") || [])
    const isValid = (f: HTMLInputElement) => {
        if (f.type === "checkbox") return !f.required || f.checked
        const v = f.value.trim()
        if (f.required && v === "") return false
        if (f.type === "email" && v !== "" && !emailShape.test(v)) return false
        return f.checkValidity()
    }
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const next: Record<string, boolean> = {}
        let first: HTMLInputElement | null = null
        fieldsOf().forEach((f) => {
            const ok = isValid(f)
            next[f.name] = !ok
            if (!ok && !first) first = f
        })
        setInvalid(next)
        if (first) {
            ;(first as HTMLInputElement).focus()
            setNotice({ text: msgMissing, ok: false })
            return
        }
        setNotice({ text: msgOk, ok: true })
    }
    const recheck = (e: React.SyntheticEvent<HTMLFormElement>, onlyMarked: boolean) => {
        const f = e.target as HTMLInputElement
        if (!f.name || (onlyMarked && !invalid[f.name])) return
        if (!onlyMarked && f.type !== "checkbox" && f.value.trim() === "" && !invalid[f.name]) return
        setInvalid((s) => ({ ...s, [f.name]: !isValid(f) }))
    }
    const field = (id: string, label: string, icon: string, opts: any = {}) => (
        <div className={`field${opts.wide ? " field--wide" : ""}${invalid[id] ? " is-invalid" : ""}`}>
            <label htmlFor={`ev-${id}`}>{label}</label>
            <div className="field__control">
                <i className={`ph ph-${icon}`} aria-hidden="true"></i>
                <input id={`ev-${id}`} name={id} type={opts.type || "text"} required autoComplete={opts.auto} maxLength={opts.max || 80} pattern={opts.pattern} inputMode={opts.mode} aria-invalid={invalid[id] ? "true" : undefined} />
            </div>
        </div>
    )

    const meta = (ev: any) => (
        <ul className="ev-meta">
            <li><i className="ph ph-calendar-blank" aria-hidden="true"></i>{longDate(ev.when)}</li>
            {ev.time ? <li><i className="ph ph-clock" aria-hidden="true"></i>{ev.time}</li> : null}
            {ev.place ? <li><i className="ph ph-map-pin" aria-hidden="true"></i>{ev.place}</li> : null}
            {ev.free ? <li><i className="ph ph-ticket" aria-hidden="true"></i>Entrada libre</li> : null}
        </ul>
    )

    const reveal = isCanvas() ? "" : " reveal"
    const counts = { proximos: upcoming.length, pasados: past.length, todos: all.length }
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            {/* Próximo evento */}
            <section className="section ev-next" aria-labelledby="ev-next-title">
                <div className="container">
                    <div className={`ev-next__inner${now ? " is-ready" : ""}`}>
                        {next ? (
                            <article className="ev-feature">
                                <button className="ev-feature__media" type="button" onClick={() => openEvent(next.slug)} aria-label={`Ver detalles de ${next.title}`}>
                                    <img src={sized(next.imageUrl, 1600)} alt="" />
                                    <span className="ev-stamp" aria-hidden="true">
                                        <b>{pad(next.when.getDate())}</b>
                                        <small>{fmt(next.when, { month: "short" }).replace(".", "")}</small>
                                    </span>
                                </button>
                                <div className="ev-feature__body">
                                    <p className="eyebrow-title eyebrow-title--dark">
                                        <span className={`ev-status${next.soon ? " is-soon" : ""}`}>{next.status}</span>
                                        Próximo evento
                                    </p>
                                    <h2 className="ev-feature__title" id="ev-next-title">{next.title}</h2>
                                    {meta(next)}
                                    <p className="ev-feature__summary">{next.summary}</p>
                                    {now ? <Countdown to={next.when} now={now} /> : null}
                                    <div className="ev-actions">
                                        {next.register ? (
                                            <button className="btn btn--dark" type="button" onClick={() => openEvent(next.slug, "registro")}>
                                                Regístrate <i className="ph ph-arrow-right" aria-hidden="true"></i>
                                            </button>
                                        ) : null}
                                        <button className="btn btn--line" type="button" onClick={() => openEvent(next.slug)}>Ver detalles</button>
                                        <button className="ev-icon-btn" type="button" onClick={() => downloadIcs(next, eventUrl(next.slug))} aria-label="Agregar al calendario" title="Agregar al calendario">
                                            <i className="ph ph-calendar-plus" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ) : (
                            <div className="ev-empty">
                                <i className="ph ph-calendar-dots" aria-hidden="true"></i>
                                <div>
                                    <h2 className="ev-empty__title" id="ev-next-title">{emptyTitle}</h2>
                                    <p>{emptyText}</p>
                                </div>
                                <a className="btn btn--dark" href={emptyLink}>
                                    {emptyCta} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Agenda */}
            <section className="section ev-agenda" aria-labelledby="ev-agenda-title">
                <div className="container">
                    <div className="ev-agenda__head">
                        <header className={`discover__head${reveal} reveal--stagger`}>
                            <Split className="discover__title" id="ev-agenda-title" text={title} />
                            <p className="discover__lead">{lead}</p>
                        </header>
                        <div className="venue-toggle venue-toggle--light" role="group" aria-label="Mostrar eventos">
                            {(["proximos", "pasados", "todos"] as const).map((f) => (
                                <button key={f} type="button" aria-pressed={filter === f} onClick={() => choose(f)}>
                                    {f === "proximos" ? "Próximos" : f === "pasados" ? "Pasados" : "Todos"}
                                    <span className="ev-count">{counts[f]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {groups.length ? (
                        groups.map((g) => (
                            <div className="ev-month" key={`${filter}-${g.label}`}>
                                <h3 className="ev-month__title">{g.label}</h3>
                                <ol className="ev-list">
                                    {g.items.map((ev, i) => (
                                        <li key={ev.slug} className={`ev-row${ev.past ? " is-past" : ""}`} style={{ ["--i" as any]: i }}>
                                            <button className="ev-row__btn" type="button" onClick={() => openEvent(ev.slug)}>
                                                <span className="ev-row__date">
                                                    <b>{pad(ev.when.getDate())}</b>
                                                    <small>{fmt(ev.when, { weekday: "short" }).replace(".", "")}</small>
                                                </span>
                                                <span className="ev-row__img"><img src={sized(ev.imageUrl, 800)} alt="" loading="lazy" /></span>
                                                <span className="ev-row__info">
                                                    <span className="ev-row__tags">
                                                        {ev.tag ? <span className="ev-tag">{ev.tag}</span> : null}
                                                        {ev.status ? <span className={`ev-status${ev.soon ? " is-soon" : ""}${ev.past ? " is-past" : ""}`}>{ev.status}</span> : null}
                                                    </span>
                                                    <span className="ev-row__title">{ev.title}</span>
                                                    <span className="ev-row__meta">{[ev.time, ev.place].filter(Boolean).join(" · ")}</span>
                                                </span>
                                                <span className="ev-row__go" aria-hidden="true"><i className="ph ph-arrow-up-right"></i></span>
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))
                    ) : (
                        <p className="ev-none">{filter === "proximos" ? "No hay eventos próximos por ahora." : "Todavía no hay eventos pasados."}</p>
                    )}
                </div>
            </section>

            {/* Detalle */}
            <dialog className="ev-panel" ref={dialog} aria-labelledby="ev-panel-title" onClose={onClosed} onClick={(e) => e.target === e.currentTarget && closeEvent()}>
                {active ? (
                    <div className="ev-panel__scroll">
                        <div className="ev-panel__media">
                            <img src={sized(active.imageUrl, 1400)} alt={active.title} />
                            <button className="lightbox__btn ev-panel__close" type="button" onClick={closeEvent} aria-label="Cerrar">
                                <i className="ph ph-x" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div className="ev-panel__body">
                            <p className="ev-row__tags">
                                {active.tag ? <span className="ev-tag">{active.tag}</span> : null}
                                {active.status ? <span className={`ev-status${active.soon ? " is-soon" : ""}${active.past ? " is-past" : ""}`}>{active.status}</span> : null}
                            </p>
                            <h2 className="ev-panel__title" id="ev-panel-title">{active.title}</h2>
                            {meta(active)}

                            {view === "detalle" ? (
                                <>
                                    <div className="ev-panel__text">
                                        {String(active.body || active.summary).split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
                                    </div>
                                    {active.extraUrl ? <img className="ev-panel__extra" src={sized(active.extraUrl, 1200)} alt="" loading="lazy" /> : null}
                                    {active.sponsorList.length ? (
                                        <div className="ev-panel__sponsors">
                                            <p className="ev-label">Con el apoyo de</p>
                                            <Sponsors list={active.sponsorList} />
                                        </div>
                                    ) : null}
                                    <div className="ev-actions">
                                        {active.register && !active.past ? (
                                            <button className="btn btn--dark" type="button" onClick={() => { setView("registro"); setNotice({ text: "", ok: false }) }}>
                                                Regístrate <i className="ph ph-arrow-right" aria-hidden="true"></i>
                                            </button>
                                        ) : null}
                                        {!active.past ? (
                                            <button className="btn btn--line" type="button" onClick={() => downloadIcs(active, eventUrl(active.slug))}>
                                                <i className="ph ph-calendar-plus" aria-hidden="true"></i> Agregar al calendario
                                            </button>
                                        ) : null}
                                        <button className="btn btn--line" type="button" onClick={() => share(active)}>
                                            <i className="ph ph-share-network" aria-hidden="true"></i> Compartir
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <form className="ev-form" ref={form} noValidate onSubmit={onSubmit} onBlur={(e) => recheck(e, false)} onInput={(e) => recheck(e, true)} onChange={(e) => recheck(e, true)}>
                                    <p className="ev-form__note">{registerNote}</p>
                                    <div className="ev-form__grid">
                                        {field("nombres", "Nombres", "user", { auto: "given-name" })}
                                        {field("apellidos", "Apellidos", "user", { auto: "family-name" })}
                                        {field("email", "Email", "envelope-simple", { type: "email", auto: "email", max: 120, wide: true })}
                                        {field("telefono", "Teléfono", "phone", { type: "tel", auto: "tel", max: 20, mode: "tel", pattern: "[0-9+\\s\\(\\)\\-]{7,20}", wide: true })}
                                    </div>
                                    <label className={`venue-consent${invalid.consentimiento ? " is-invalid" : ""}`}>
                                        <input type="checkbox" name="consentimiento" required aria-invalid={invalid.consentimiento ? "true" : undefined} />
                                        <span>{consent}</span>
                                    </label>
                                    <p className={`ev-form__status${notice.ok ? " is-ok" : ""}`} role="status" aria-live="polite">{notice.text}</p>
                                    <div className="ev-actions">
                                        <button className="form__submit" type="submit">
                                            Enviar registro <span><i className="ph ph-arrow-right" aria-hidden="true"></i></span>
                                        </button>
                                        <button className="ev-back" type="button" onClick={() => setView("detalle")}>
                                            <i className="ph ph-arrow-left" aria-hidden="true"></i> Volver al detalle
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                ) : null}
            </dialog>

            <div className={`toast${toast.visible ? " is-visible" : ""}`} role="status" aria-live="polite" hidden={!toast.text}>
                {toast.text}
            </div>
        </div>
    )
}

EventsAgenda.defaultProps = {
    title: "Agenda",
    lead: "Elige un evento para ver los detalles, registrarte o guardarlo en tu calendario. Cada asistente llena su propio registro.",
    emptyTitle: "Estamos preparando la próxima agenda",
    emptyText: "Por ahora no hay eventos programados. Suscríbete y te avisamos apenas publiquemos el siguiente.",
    emptyCta: "Quiero enterarme",
    emptyLink: "/#suscripcion",
    registerNote: "Cada asistente debe llenar su propio registro.",
    consent: "Autorizo a Alhambra Shopping – Cobilhambra S.A. a contactarme sobre este evento. Mi información es confidencial.",
    msgMissing: "Faltan campos por llenar.",
    msgOk: "Datos completos. El registro en línea aún no está activo.",
    today: "",
    events: EVENTS,
}

addPropertyControls(EventsAgenda, {
    title: { type: ControlType.String, title: "Título", defaultValue: EventsAgenda.defaultProps.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: EventsAgenda.defaultProps.lead },
    emptyTitle: { type: ControlType.String, title: "Sin eventos · título", defaultValue: EventsAgenda.defaultProps.emptyTitle },
    emptyText: { type: ControlType.String, title: "Sin eventos · texto", displayTextArea: true, defaultValue: EventsAgenda.defaultProps.emptyText },
    emptyCta: { type: ControlType.String, title: "Sin eventos · botón", defaultValue: EventsAgenda.defaultProps.emptyCta },
    emptyLink: { type: ControlType.Link, title: "Sin eventos · enlace", defaultValue: EventsAgenda.defaultProps.emptyLink },
    registerNote: { type: ControlType.String, title: "Registro · nota", defaultValue: EventsAgenda.defaultProps.registerNote },
    consent: { type: ControlType.String, title: "Registro · autorización", displayTextArea: true, defaultValue: EventsAgenda.defaultProps.consent },
    msgMissing: { type: ControlType.String, title: "Mensaje · faltan datos", defaultValue: EventsAgenda.defaultProps.msgMissing },
    msgOk: { type: ControlType.String, title: "Mensaje · completo", defaultValue: EventsAgenda.defaultProps.msgOk },
    today: { type: ControlType.String, title: "Simular fecha (AAAA-MM-DD)", defaultValue: "" },
    events: {
        type: ControlType.Array,
        title: "Eventos",
        defaultValue: EVENTS,
        control: {
            type: ControlType.Object,
            controls: {
                slug: { type: ControlType.String, title: "Enlace (slug)" },
                date: { type: ControlType.String, title: "Fecha (AAAA-MM-DDTHH:MM)" },
                time: { type: ControlType.String, title: "Hora (texto)" },
                tag: { type: ControlType.String, title: "Categoría" },
                title: { type: ControlType.String, title: "Título" },
                place: { type: ControlType.String, title: "Lugar" },
                summary: { type: ControlType.String, title: "Resumen", displayTextArea: true },
                body: { type: ControlType.String, title: "Descripción", displayTextArea: true },
                imageUrl: { type: ControlType.String, title: "Imagen (URL)" },
                extraUrl: { type: ControlType.String, title: "Imagen extra (URL)" },
                sponsors: { type: ControlType.String, title: "Patrocinios (URLs, comas)" },
                register: { type: ControlType.Boolean, title: "Requiere registro" },
                free: { type: ControlType.Boolean, title: "Entrada libre" },
            },
        },
    },
})
