// Alhambra Shopping — página de cada evento (/eventos/<slug>, página CMS de
// Framer). Cada propiedad se conecta directo a su campo del CMS (aquí no hace
// falta puente). Mismo contenido que el panel de la agenda: imagen, fecha,
// lugar, descripción, auspiciantes, registro, agregar al calendario y
// compartir. /eventos/<slug>#registro abre el formulario.
import { useEffect, useMemo, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, ROOT_CLASS } from "./Theme.tsx"
import { isCanvas, parseDate } from "./Behaviors.tsx"
import { Btn } from "./Button.tsx"
import { toCmsEvent, EVENT_FIELD_CONTROLS } from "./EventsCms.tsx"
import {
    sized, statusOf, withDates, downloadIcs, useToast, shareEvent,
    Sponsors, EventMeta, RegisterForm, REGISTER_TEXTS, paragraphs,
} from "./EventShared.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function EventDetail(props) {
    useAlhambraStyles()
    const { backLabel, backLink, registerNote, consent, msgMissing, msgOk, today: todayProp } = props
    const ev = useMemo(() => withDates(toCmsEvent(props)), [props])
    const [toastNode, showToast] = useToast()

    // «Hoy» se fija tras montar (el HTML del servidor no sabe la fecha del
    // visitante). ?hoy=AAAA-MM-DD o «Simular fecha» prueban otra fecha.
    const [today, setToday] = useState<Date | null>(null)
    const [view, setView] = useState<"detalle" | "registro">("detalle")
    useEffect(() => {
        const forced = new URLSearchParams(location.search).get("hoy") || todayProp
        const t = forced ? parseDate(forced) : new Date()
        t.setHours(0, 0, 0, 0)
        setToday(t)
        if (!isCanvas() && location.hash === "#registro") setView("registro")
    }, [todayProp])

    const past = today ? ev.when < today : false
    const status = today && ev.date ? statusOf(ev.when, today) : ""
    const canRegister = ev.register && !past

    const openForm = () => {
        setView("registro")
        if (!isCanvas()) history.replaceState(history.state, "", "#registro")
        requestAnimationFrame(() => document.getElementById("ev-page-body")?.scrollIntoView({ behavior: "smooth", block: "start" }))
    }
    const closeForm = () => {
        setView("detalle")
        if (!isCanvas()) history.replaceState(history.state, "", location.pathname + location.search)
    }

    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }}>
            <header className="ev-page__head">
                <div className="container">
                    <a className="ev-page__back" href={backLink}>
                        <i className="ph ph-arrow-left" aria-hidden="true"></i> {backLabel}
                    </a>
                    <p className="ev-row__tags">
                        {ev.tag ? <span className="ev-tag">{ev.tag}</span> : null}
                        {status ? <span className={`ev-status${past ? " is-past" : ""}`}>{status}</span> : null}
                    </p>
                    <h1 className="ev-page__title">{ev.title || "Evento"}</h1>
                    {ev.date ? <EventMeta ev={ev} /> : null}
                </div>
            </header>

            <section className="section ev-page__main">
                <div className="container ev-page__grid">
                    <div className="ev-page__media">
                        {ev.imageUrl ? <img src={sized(ev.imageUrl, 1600)} alt={ev.title} /> : null}
                    </div>

                    <div className="ev-page__body" id="ev-page-body">
                        {view === "detalle" || !canRegister ? (
                            <>
                                <div className="ev-page__text">
                                    {paragraphs(ev.body || ev.summary).map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                                {ev.extraUrl ? <img className="ev-panel__extra" src={sized(ev.extraUrl, 1200)} alt="" loading="lazy" /> : null}
                                {ev.sponsorList.length ? (
                                    <div className="ev-panel__sponsors">
                                        <p className="ev-label">Con el apoyo de</p>
                                        <Sponsors list={ev.sponsorList} />
                                    </div>
                                ) : null}
                                <div className="ev-actions">
                                    {canRegister ? <Btn variant="dark" onClick={openForm}>Regístrate</Btn> : null}
                                    {!past && ev.date ? (
                                        <Btn variant="line" icon="calendar-plus" onClick={() => downloadIcs(ev)}>Agregar al calendario</Btn>
                                    ) : null}
                                    <Btn variant="line" icon="share-network" onClick={() => shareEvent(ev, showToast)}>Compartir</Btn>
                                </div>
                            </>
                        ) : (
                            <RegisterForm id="ev-page" note={registerNote} consent={consent} msgMissing={msgMissing} msgOk={msgOk} onBack={closeForm} />
                        )}
                    </div>
                </div>
            </section>

            {toastNode}
        </div>
    )
}

EventDetail.displayName = "EventDetail"

EventDetail.defaultProps = {
    backLabel: "Todos los eventos",
    backLink: "/eventos",
    ...REGISTER_TEXTS,
    today: "",
}

addPropertyControls(EventDetail, {
    ...EVENT_FIELD_CONTROLS,
    backLabel: { type: ControlType.String, title: "Volver · texto", defaultValue: EventDetail.defaultProps.backLabel },
    backLink: { type: ControlType.Link, title: "Volver · enlace", defaultValue: EventDetail.defaultProps.backLink },
    registerNote: { type: ControlType.String, title: "Registro · nota", defaultValue: REGISTER_TEXTS.registerNote },
    consent: { type: ControlType.String, title: "Registro · autorización", displayTextArea: true, defaultValue: REGISTER_TEXTS.consent },
    msgMissing: { type: ControlType.String, title: "Mensaje · faltan datos", defaultValue: REGISTER_TEXTS.msgMissing },
    msgOk: { type: ControlType.String, title: "Mensaje · completo", defaultValue: REGISTER_TEXTS.msgOk },
    today: { type: ControlType.String, title: "Simular fecha (AAAA-MM-DD)", defaultValue: "" },
})
