// Alhambra Shopping — página /eventos: próximo evento destacado con cuenta
// regresiva, agenda por meses (próximos / pasados / todos) y panel de detalle
// con registro, «Agregar al calendario» (.ics) y compartir.
// Cada evento tiene página propia (/eventos/<slug>); /eventos?evento=<slug>
// sigue abriendo su panel para los enlaces ya compartidos.
// No hay backend: el registro valida pero no afirma que se envió.
import { useEffect, useMemo, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, Split, ROOT_CLASS, useReveal } from "./Theme.tsx"
import { isCanvas, parseDate } from "./Behaviors.tsx"
import { Btn } from "./Button.tsx"
import {
    DAY, pad, sized, fmt, monthTitle, statusOf, withDates, eventPath, downloadIcs, useToast, shareEvent,
    Sponsors, EventMeta, RegisterForm, REGISTER_TEXTS, paragraphs,
} from "./EventShared.tsx"
import { Toggle } from "./Toggle.tsx"
import { useCmsEvents } from "./EventsCms.tsx"

export const EVENTS = [
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
    const events = useCmsEvents(props.events || []) as any[]
    const root = useRef<HTMLDivElement>(null)
    const dialog = useRef<HTMLDialogElement>(null)
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
            (events).map((e) => {
                const ev = withDates(e)
                const past = now ? ev.when < today : false
                return {
                    ...ev,
                    past,
                    status: now ? statusOf(ev.when, today) : "",
                    soon: now ? !past && ev.when.getTime() - today.getTime() < 8 * DAY : false,
                }
            }),
        [events, dayKey]
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
    const [toastNode, showToast] = useToast()
    const active = all.find((e) => e.slug === openSlug)

    const setParam = (slug: string) => {
        const url = new URL(location.href)
        if (slug) url.searchParams.set("evento", slug)
        else url.searchParams.delete("evento")
        history.replaceState(history.state, "", url)
    }

    const openEvent = (slug: string, mode: "detalle" | "registro" = "detalle") => {
        setOpenSlug(slug)
        setView(mode)
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

    // Enlace directo: /eventos?evento=<slug>. Se reintenta cuando llegan los
    // eventos del CMS, pero solo se abre una vez.
    const deepLinked = useRef(false)
    useEffect(() => {
        if (isCanvas() || deepLinked.current) return
        const slug = new URLSearchParams(location.search).get("evento")
        if (slug && events.some((e) => e.slug === slug)) {
            deepLinked.current = true
            openEvent(slug)
        }
    }, [events])

    const share = (ev: any) => shareEvent(ev, showToast)
    const meta = (ev: any) => <EventMeta ev={ev} />

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
                                            <Btn variant="dark" onClick={() => openEvent(next.slug, "registro")}>Regístrate</Btn>
                                        ) : null}
                                        <Btn variant="line" icon="plus" onClick={() => openEvent(next.slug)}>Ver detalles</Btn>
                                        <button className="ev-icon-btn" type="button" onClick={() => downloadIcs(next)} aria-label="Agregar al calendario" title="Agregar al calendario">
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
                                <Btn variant="dark" href={emptyLink}>{emptyCta}</Btn>
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
                        <Toggle
                            variant="light"
                            label="Mostrar eventos"
                            value={filter}
                            onChange={choose}
                            options={[
                                { value: "proximos", label: "Próximos", count: counts.proximos },
                                { value: "pasados", label: "Pasados", count: counts.pasados },
                                { value: "todos", label: "Todos", count: counts.todos },
                            ]}
                        />
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
                                        {paragraphs(active.body || active.summary).map((p, i) => <p key={i}>{p}</p>)}
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
                                            <Btn variant="dark" onClick={() => setView("registro")}>Regístrate</Btn>
                                        ) : null}
                                        {!active.past ? (
                                            <Btn variant="line" icon="calendar-plus" onClick={() => downloadIcs(active)}>Agregar al calendario</Btn>
                                        ) : null}
                                        <Btn variant="line" icon="share-network" onClick={() => share(active)}>Compartir</Btn>
                                        <a className="ev-back" href={eventPath(active.slug)}>
                                            Ver página del evento <i className="ph ph-arrow-up-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <RegisterForm key={active.slug} note={registerNote} consent={consent} msgMissing={msgMissing} msgOk={msgOk} onBack={() => setView("detalle")} />
                            )}
                        </div>
                    </div>
                ) : null}
            </dialog>

            {toastNode}
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
    ...REGISTER_TEXTS,
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
