// Alhambra Shopping — «Mantente conectado»: formulario con validación
// No hay backend todavía: el mensaje final no afirma que los datos se enviaron.
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, Split, ROOT_CLASS, useReveal, POLICY_PATH } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"
import { Btn } from "./Button.tsx"

const emailShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const FIELDS = [
    { id: "nombres", label: "Nombres", icon: "user", type: "text", auto: "given-name", required: true, max: 80 },
    { id: "apellidos", label: "Apellidos", icon: "user", type: "text", auto: "family-name", required: true, max: 80 },
    { id: "email", label: "Email", icon: "envelope-simple", type: "email", auto: "email", required: true, max: 120, wide: true },
    { id: "telefono", label: "Teléfono", icon: "phone", type: "tel", auto: "tel", required: false, max: 20, pattern: "[0-9+\\s\\(\\)\\-]{7,20}" },
    { id: "ciudad", label: "Ciudad", icon: "map-pin", type: "text", auto: "address-level2", required: true, max: 60 },
]

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Subscribe(props) {
    useAlhambraStyles()
    const { title, sub, lead, submitLabel, msgMissing, msgOk, policyText, policyLabel, policyLink } = props
    const root = useRef<HTMLDivElement>(null)
    const form = useRef<HTMLFormElement>(null)
    const [invalid, setInvalid] = useState<Record<string, boolean>>({})
    const [toast, setToast] = useState({ text: "", visible: false })
    const timer = useRef<any>(0)
    useReveal(root)

    // Email que llega desde el footer (?email=…#suscripcion)
    useEffect(() => {
        const email = new URLSearchParams(location.search).get("email")
        const input = form.current?.querySelector<HTMLInputElement>("#f-email")
        if (email && input) input.value = email
    }, [])

    const isValid = (input: HTMLInputElement) => {
        const value = input.value.trim()
        if (input.required && value === "") return false
        if (input.type === "email" && value !== "" && !emailShape.test(value)) return false
        return input.checkValidity()
    }

    const showToast = (text: string) => {
        clearTimeout(timer.current)
        setToast({ text, visible: false })
        requestAnimationFrame(() => {
            setToast({ text, visible: true })
            timer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4200)
        })
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const inputs = Array.from(form.current!.querySelectorAll("input"))
        const next: Record<string, boolean> = {}
        let first: HTMLInputElement | null = null
        inputs.forEach((input) => {
            const ok = isValid(input)
            next[input.name] = !ok
            if (!ok && !first) first = input
        })
        setInvalid(next)
        if (first) {
            ;(first as HTMLInputElement).focus()
            showToast(msgMissing)
            return
        }
        showToast(msgOk)
    }

    const onBlur = (e: React.FocusEvent<HTMLFormElement>) => {
        const input = e.target as unknown as HTMLInputElement
        if (!(input instanceof HTMLInputElement)) return
        if (input.value.trim() === "" && !invalid[input.name]) return
        setInvalid((s) => ({ ...s, [input.name]: !isValid(input) }))
    }
    const onInput = (e: React.FormEvent<HTMLFormElement>) => {
        const input = e.target as unknown as HTMLInputElement
        if (invalid[input.name] && isValid(input)) setInvalid((s) => ({ ...s, [input.name]: false }))
        setToast((t) => ({ ...t, visible: false }))
    }

    const field = (f) => (
        <div className={`field${f.wide ? " field--wide" : ""}${invalid[f.id] ? " is-invalid" : ""}`} key={f.id}>
            <label htmlFor={`f-${f.id}`}>
                {f.label}
                {!f.required ? <> <span className="field__opt">(opcional)</span></> : null}
            </label>
            <div className="field__control">
                <i className={`ph ph-${f.icon}`} aria-hidden="true"></i>
                <input
                    id={`f-${f.id}`}
                    name={f.id}
                    type={f.type}
                    autoComplete={f.auto}
                    required={f.required}
                    maxLength={f.max}
                    pattern={f.pattern}
                    inputMode={f.type === "tel" ? "tel" : undefined}
                    spellCheck={f.type === "email" ? false : undefined}
                    aria-invalid={invalid[f.id] ? "true" : undefined}
                />
            </div>
        </div>
    )

    const reveal = isCanvas() ? "" : " reveal"
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            <section className="section subscribe" id="suscripcion" aria-labelledby="subscribe-title">
                <div className="container">
                    <header className={`discover__head discover__head--center${reveal} reveal--stagger`}>
                        <Split className="discover__title" id="subscribe-title" text={title} />
                        <p className="discover__sub">{sub}</p>
                        <p className="discover__lead">{lead}</p>
                    </header>

                    <form className={`form${reveal}`} ref={form} noValidate onSubmit={onSubmit} onBlur={onBlur} onInput={onInput}>
                        {field(FIELDS[0])}
                        {field(FIELDS[1])}
                        {field(FIELDS[2])}
                        <div className="form__row">
                            {field(FIELDS[3])}
                            {field(FIELDS[4])}
                        </div>
                        <p className="form__policy field--wide">
                            {policyText}{" "}
                            <a className="policy-link" href={policyLink} target="_blank" rel="noopener noreferrer">{policyLabel}</a>.
                        </p>
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

Subscribe.defaultProps = {
    title: "Mantente conectado",
    sub: "Eventos y promociones, directo a tu correo.",
    lead: "Déjanos tus datos y sé de los primeros en enterarte de nuestros próximos eventos, novedades y experiencias especiales.",
    submitLabel: "Enviar",
    policyText: "Tratamos tus datos según nuestra",
    policyLabel: "Política de Protección de Datos Personales",
    policyLink: POLICY_PATH,
    msgMissing: "Faltan campos por llenar.",
    msgOk: "Datos completos. La suscripción en línea aún no está activa.",
}

addPropertyControls(Subscribe, {
    title: { type: ControlType.String, title: "Título", defaultValue: Subscribe.defaultProps.title },
    sub: { type: ControlType.String, title: "Subtítulo", defaultValue: Subscribe.defaultProps.sub },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: Subscribe.defaultProps.lead },
    submitLabel: { type: ControlType.String, title: "Botón", defaultValue: "Enviar" },
    msgMissing: { type: ControlType.String, title: "Mensaje · faltan datos", defaultValue: Subscribe.defaultProps.msgMissing },
    msgOk: { type: ControlType.String, title: "Mensaje · completo", defaultValue: Subscribe.defaultProps.msgOk },
    policyText: { type: ControlType.String, title: "Política · texto", defaultValue: Subscribe.defaultProps.policyText },
    policyLabel: { type: ControlType.String, title: "Política · enlace", defaultValue: Subscribe.defaultProps.policyLabel },
    policyLink: { type: ControlType.Link, title: "Política de datos", defaultValue: POLICY_PATH },
})
