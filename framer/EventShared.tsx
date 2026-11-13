// Alhambra Shopping — piezas comunes de la agenda (/eventos) y de la página
// de cada evento (/eventos/<slug>): fechas, «Agregar al calendario» (.ics),
// compartir, auspiciantes, datos del evento y formulario de registro.
// Este archivo no es un componente.
import { useRef, useState } from "react"
import { parseDate } from "./Behaviors.tsx"
import { Btn } from "./Button.tsx"

export const DAY = 86400000
export const pad = (n: number) => String(n).padStart(2, "0")
export const sized = (url: string, w: number) => (!url || url.includes("?") ? url : `${url}?scale-down-to=${w}`)
export const hasTime = (value: string) => String(value).includes("T")

export const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("es-EC", opts).format(d)
const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
export const longDate = (d: Date) => capital(fmt(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" }))
export const monthTitle = (d: Date) => capital(fmt(d, { month: "long", year: "numeric" }))

export const statusOf = (date: Date, today: Date) => {
    const day = new Date(date)
    day.setHours(0, 0, 0, 0)
    const diff = Math.round((day.getTime() - today.getTime()) / DAY)
    if (diff < 0) return "Finalizado"
    if (diff === 0) return "Hoy"
    if (diff === 1) return "Mañana"
    return `En ${diff} días`
}

/** Campos calculados que usan la agenda y la página del evento. */
export function withDates<T extends { date: string; sponsors?: string }>(e: T) {
    return {
        ...e,
        when: parseDate(e.date),
        timed: hasTime(e.date),
        sponsorList: String(e.sponsors || "").split(",").map((s) => s.trim()).filter(Boolean),
    }
}

/** Enlace propio de cada evento. */
export const eventPath = (slug: string) => `/eventos/${encodeURIComponent(slug)}`
export const eventUrl = (slug: string) => (typeof location === "undefined" ? "" : `${location.origin}${eventPath(slug)}`)

// --- Agregar al calendario (.ics, sin servicios externos) -------------------

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

export function downloadIcs(ev: any) {
    const url = eventUrl(ev.slug)
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

// --- Compartir y aviso -------------------------------------------------------

export function useToast() {
    const [toast, setToast] = useState({ text: "", visible: false })
    const timer = useRef<any>(0)
    const show = (text: string) => {
        clearTimeout(timer.current)
        setToast({ text, visible: false })
        requestAnimationFrame(() => {
            setToast({ text, visible: true })
            timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3200)
        })
    }
    const node = (
        <div className={`toast${toast.visible ? " is-visible" : ""}`} role="status" aria-live="polite" hidden={!toast.text}>
            {toast.text}
        </div>
    )
    return [node, show] as const
}

export async function shareEvent(ev: any, showToast: (text: string) => void) {
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

// --- Piezas de la ficha -------------------------------------------------------

export function Sponsors({ list }: { list: string[] }) {
    if (!list.length) return null
    return (
        <ul className="sponsors" aria-label="Con el apoyo de">
            {list.map((url, i) => (
                <li key={i}><img src={url} alt={`Patrocinio ${i + 1}`} loading="lazy" /></li>
            ))}
        </ul>
    )
}

export function EventMeta({ ev }: { ev: any }) {
    return (
        <ul className="ev-meta">
            <li><i className="ph ph-calendar-blank" aria-hidden="true"></i>{longDate(ev.when)}</li>
            {ev.time ? <li><i className="ph ph-clock" aria-hidden="true"></i>{ev.time}</li> : null}
            {ev.place ? <li><i className="ph ph-map-pin" aria-hidden="true"></i>{ev.place}</li> : null}
            {ev.free ? <li><i className="ph ph-ticket" aria-hidden="true"></i>Entrada libre</li> : null}
        </ul>
    )
}

export const paragraphs = (text: string) => String(text || "").split(/\n{2,}/).filter(Boolean)

// --- Registro (no hay backend: valida pero no afirma que se envió) ------------

const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const REGISTER_TEXTS = {
    registerNote: "Cada asistente debe llenar su propio registro.",
    consent: "Autorizo a Alhambra Shopping – Cobilhambra S.A. a contactarme sobre este evento. Mi información es confidencial.",
    msgMissing: "Faltan campos por llenar.",
    msgOk: "Datos completos. El registro en línea aún no está activo.",
}

export function RegisterForm({ note, consent, msgMissing, msgOk, onBack, backLabel = "Volver al detalle", id = "ev" }) {
    const form = useRef<HTMLFormElement>(null)
    const [invalid, setInvalid] = useState<Record<string, boolean>>({})
    const [notice, setNotice] = useState({ text: "", ok: false })

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
    const field = (name: string, label: string, icon: string, opts: any = {}) => (
        <div className={`field${opts.wide ? " field--wide" : ""}${invalid[name] ? " is-invalid" : ""}`}>
            <label htmlFor={`${id}-${name}`}>{label}</label>
            <div className="field__control">
                <i className={`ph ph-${icon}`} aria-hidden="true"></i>
                <input id={`${id}-${name}`} name={name} type={opts.type || "text"} required autoComplete={opts.auto} maxLength={opts.max || 80} pattern={opts.pattern} inputMode={opts.mode} aria-invalid={invalid[name] ? "true" : undefined} />
            </div>
        </div>
    )

    return (
        <form className="ev-form" ref={form} noValidate onSubmit={onSubmit} onBlur={(e) => recheck(e, false)} onInput={(e) => recheck(e, true)} onChange={(e) => recheck(e, true)}>
            <p className="ev-form__note">{note}</p>
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
                <Btn variant="dark" type="submit" block>Enviar registro</Btn>
                {onBack ? (
                    <button className="ev-back" type="button" onClick={onBack}>
                        <i className="ph ph-arrow-left" aria-hidden="true"></i> {backLabel}
                    </button>
                ) : null}
            </div>
        </form>
    )
}
