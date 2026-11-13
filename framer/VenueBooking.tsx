// Alhambra Shopping — formulario de reserva del Salón Auditorio (#reservas)
// No hay backend todavía: el mensaje final no afirma que la solicitud se envió.
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, Split, ROOT_CLASS, useReveal } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"
import { Btn } from "./Button.tsx"
import { Toggle } from "./Toggle.tsx"

const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const PERSONAL = ["Matrimonio", "Aniversario", "Fiesta", "Agasajo", "Exposición", "Conferencia", "Charla o capacitación", "Otro"]
const CORPORATE = ["Conferencia", "Aniversario", "Lanzamiento", "Fiesta", "Cóctel", "Charla o taller", "Exposición", "Ceremonia de fe o religión", "Otro"]
const GUESTS = ["Hasta 50 personas", "50 a 100", "101 a 300", "301 a 500", "501 a 700", "701 a 900", "901 a 1.000", "2.000 a 3.000", "3.000 o más"]
const AREAS = ["Auditorio", "Salón", "Rooftop", "Salón y rooftop", "Auditorio y rooftop"]

type Field = Element & { name: string; value: string; required: boolean; type: string; checked?: boolean; checkValidity(): boolean; focus(): void }

const today = () => {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function VenueBooking(props) {
    useAlhambraStyles()
    const { eyebrow, title, lead, address, mapLink, notes, consent, submitLabel, msgMissing, msgOk } = props
    const root = useRef<HTMLDivElement>(null)
    const form = useRef<HTMLFormElement>(null)
    const [kind, setKind] = useState<"personal" | "corporativo">("personal")
    const [invalid, setInvalid] = useState<Record<string, boolean>>({})
    const [toast, setToast] = useState({ text: "", visible: false })
    const [minDate, setMinDate] = useState("")
    const timer = useRef<any>(0)
    useReveal(root)
    useEffect(() => setMinDate(today()), [])

    const corporate = kind === "corporativo"

    const fields = () => Array.from(form.current!.querySelectorAll<HTMLElement>("input, select, textarea")) as unknown as Field[]
    const isValid = (f: Field) => {
        if (f.type === "checkbox") return !f.required || Boolean(f.checked)
        const value = f.value.trim()
        if (f.required && value === "") return false
        if (f.type === "email" && value !== "" && !emailShape.test(value)) return false
        return f.checkValidity()
    }

    const showToast = (text: string) => {
        clearTimeout(timer.current)
        setToast({ text, visible: false })
        requestAnimationFrame(() => {
            setToast({ text, visible: true })
            timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4800)
        })
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const next: Record<string, boolean> = {}
        let first: Field | null = null
        fields().forEach((f) => {
            if (f.type === "radio") return
            const ok = isValid(f)
            next[f.name] = !ok
            if (!ok && !first) first = f
        })
        setInvalid(next)
        if (first) {
            ;(first as Field).focus()
            showToast(msgMissing)
            return
        }
        showToast(msgOk)
    }

    const recheck = (e: React.SyntheticEvent<HTMLFormElement>, onlyIfMarked: boolean) => {
        const f = e.target as unknown as Field
        if (!f.name || f.type === "radio") return
        if (onlyIfMarked && !invalid[f.name]) return
        if (!onlyIfMarked && f.type !== "checkbox" && f.value.trim() === "" && !invalid[f.name]) return
        setInvalid((s) => ({ ...s, [f.name]: !isValid(f) }))
        setToast((t) => ({ ...t, visible: false }))
    }

    const cls = (id: string, wide = false) => `field${wide ? " field--wide" : ""}${invalid[id] ? " is-invalid" : ""}`
    const bad = (id: string) => (invalid[id] ? ("true" as const) : undefined)

    const input = (id: string, label: string, icon: string, opts: any = {}) => (
        <div className={cls(id, opts.wide)} key={id}>
            <label htmlFor={`r-${id}`}>
                {label}
                {!opts.required ? <> <span className="field__opt">(opcional)</span></> : null}
            </label>
            <div className="field__control">
                <i className={`ph ph-${icon}`} aria-hidden="true"></i>
                <input id={`r-${id}`} name={id} type={opts.type || "text"} required={opts.required} autoComplete={opts.auto} maxLength={opts.max || 80} min={opts.min} pattern={opts.pattern} inputMode={opts.mode} aria-invalid={bad(id)} />
            </div>
        </div>
    )

    const select = (id: string, label: string, icon: string, options: string[], wide = false) => (
        <div className={cls(id, wide)} key={id + label}>
            <label htmlFor={`r-${id}`}>{label}</label>
            <div className="field__control field__control--select">
                <i className={`ph ph-${icon}`} aria-hidden="true"></i>
                <select id={`r-${id}`} name={id} required defaultValue="" aria-invalid={bad(id)}>
                    <option value="" disabled>Seleccionar</option>
                    {options.map((o) => <option key={o}>{o}</option>)}
                </select>
            </div>
        </div>
    )

    const reveal = isCanvas() ? "" : " reveal"
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            <section className="section venue-booking" id="reservas" aria-labelledby="booking-title">
                <div className="container venue-booking__grid">
                    <aside className="venue-booking__aside">
                        <header className={`discover__head${reveal} reveal--stagger`}>
                            <p className="eyebrow-title eyebrow-title--dark">{eyebrow}</p>
                            <Split className="discover__title" id="booking-title" text={title} />
                            <p className="discover__lead">{lead}</p>
                        </header>
                        <ul className={`venue-notes${reveal}`}>
                            <li>
                                <i className="ph ph-map-pin" aria-hidden="true"></i>
                                <span>
                                    {address}
                                    {mapLink ? <> <a href={mapLink} target="_blank" rel="noopener">Ver en el mapa</a></> : null}
                                </span>
                            </li>
                            {(notes || []).map((n, i) => (
                                <li key={i}>
                                    <i className={`ph ph-${n.icon}`} aria-hidden="true"></i>
                                    <span>{n.text}</span>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <form
                        className={`form venue-form${reveal}`}
                        ref={form}
                        noValidate
                        onSubmit={onSubmit}
                        onBlur={(e) => recheck(e, false)}
                        onInput={(e) => recheck(e, true)}
                        onChange={(e) => recheck(e, true)}
                    >
                        <fieldset className="venue-form__kind field--wide">
                            <legend>Tipo de evento</legend>
                            <Toggle
                                variant="block"
                                name="tipo"
                                value={kind}
                                onChange={setKind}
                                options={[
                                    { value: "personal", label: "Personal", icon: "heart" },
                                    { value: "corporativo", label: "Corporativo o institucional", icon: "briefcase" },
                                ]}
                            />
                        </fieldset>

                        {select("evento", corporate ? "¿Qué tipo de evento corporativo?" : "¿Qué tipo de evento personal?", "confetti", corporate ? CORPORATE : PERSONAL, true)}
                        {input("fecha", "Fecha del evento", "calendar-blank", { type: "date", required: true, min: minDate })}
                        {input("hora", "Hora", "clock", { type: "time", required: true })}
                        {input("nombres", "Nombres", "user", { required: true, auto: "given-name" })}
                        {input("apellidos", "Apellidos", "user", { required: true, auto: "family-name" })}
                        {corporate ? input("cargo", "Cargo", "identification-badge", { required: true, auto: "organization-title" }) : null}
                        {corporate ? input("institucion", "Institución", "buildings", { required: true, auto: "organization" }) : null}
                        {input("email", "Email", "envelope-simple", { type: "email", required: true, auto: "email", max: 120 })}
                        {input("telefono", "Teléfono", "phone", { type: "tel", required: true, auto: "tel", max: 20, mode: "tel", pattern: "[0-9+\\s\\(\\)\\-]{7,20}" })}
                        {select("asistentes", "Número aproximado de asistentes", "users-three", GUESTS)}
                        {select("area", "Área que deseas alquilar", "squares-four", AREAS)}

                        <div className="field field--wide">
                            <label htmlFor="r-detalle">
                                Cuéntanos más del evento <span className="field__opt">(opcional)</span>
                            </label>
                            <div className="field__control field__control--area">
                                <textarea id="r-detalle" name="detalle" rows={4} maxLength={1000}></textarea>
                            </div>
                        </div>

                        <label className={`venue-consent field--wide${invalid.consentimiento ? " is-invalid" : ""}`}>
                            <input type="checkbox" name="consentimiento" required aria-invalid={bad("consentimiento")} />
                            <span>{consent}</span>
                        </label>

                        <div className="form__foot field--wide">
                            <Btn variant="dark" type="submit" block>{submitLabel}</Btn>
                        </div>
                    </form>
                </div>
            </section>
            <div className={`toast${toast.visible ? " is-visible" : ""}`} role="status" aria-live="polite" hidden={!toast.text}>
                {toast.text}
            </div>
        </div>
    )
}

const NOTES = [
    { icon: "clock-countdown", text: "Se alquila por hora: salón y auditorio completos, con el foyer incluido." },
    { icon: "fork-knife", text: "No incluye catering ni licor; te compartimos nuestra lista de proveedores." },
    { icon: "speaker-simple-low", text: "Volumen máximo de 60 dB para cuidar el entorno." },
]

VenueBooking.defaultProps = {
    eyebrow: "Reservas",
    title: "Reserva tu espacio",
    lead: "Déjanos los datos de tu evento y un ejecutivo se pondrá en contacto contigo a la brevedad.",
    address: "Piso 3, Torre 1 · Vía a Samborondón y Celeste Blacio de Rendón.",
    mapLink: "https://maps.app.goo.gl/HNeZX375HAzi59UD6",
    notes: NOTES,
    consent: "Autorizo al Fideicomiso Alhambra – Cobilhambra S.A. y sus filiales a contactarme para efectos de atención, servicio y promoción. Mi información es confidencial y se usará solo para esos fines.",
    submitLabel: "Enviar solicitud",
    msgMissing: "Faltan campos por llenar.",
    msgOk: "Datos completos. Las reservas en línea aún no están activas.",
}

addPropertyControls(VenueBooking, {
    eyebrow: { type: ControlType.String, title: "Antetítulo", defaultValue: VenueBooking.defaultProps.eyebrow },
    title: { type: ControlType.String, title: "Título", defaultValue: VenueBooking.defaultProps.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: VenueBooking.defaultProps.lead },
    address: { type: ControlType.String, title: "Dirección", defaultValue: VenueBooking.defaultProps.address },
    mapLink: { type: ControlType.Link, title: "Mapa", defaultValue: VenueBooking.defaultProps.mapLink },
    notes: {
        type: ControlType.Array,
        title: "Notas",
        defaultValue: NOTES,
        control: {
            type: ControlType.Object,
            controls: {
                icon: { type: ControlType.String, title: "Ícono (Phosphor)" },
                text: { type: ControlType.String, title: "Texto" },
            },
        },
    },
    consent: { type: ControlType.String, title: "Autorización", displayTextArea: true, defaultValue: VenueBooking.defaultProps.consent },
    submitLabel: { type: ControlType.String, title: "Botón", defaultValue: VenueBooking.defaultProps.submitLabel },
    msgMissing: { type: ControlType.String, title: "Mensaje · faltan datos", defaultValue: VenueBooking.defaultProps.msgMissing },
    msgOk: { type: ControlType.String, title: "Mensaje · completo", defaultValue: VenueBooking.defaultProps.msgOk },
})
