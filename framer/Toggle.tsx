// Alhambra Shopping — botones segmentados (switch)
// Una píldora con varias opciones y una activa en oscuro. Los componentes lo
// importan como { Toggle }; la exportación por defecto es la versión para
// arrastrar al lienzo de Framer con sus controles.
//
// Variantes:
//   paper — fondo papel (por defecto, sobre fondos crema)
//   light — fondo blanco (sobre papel o tarjetas)
//   block — ancho completo en rejilla, para formularios
//
// Sin `name` cada opción es un <button aria-pressed>. Con `name` son radios
// dentro de <label>, para que el valor viaje con el formulario.
import { useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, ROOT_CLASS } from "./Theme.tsx"

export type ToggleOption<T extends string | number> = {
    value: T
    label: React.ReactNode
    /** Nombre de un ícono Phosphor */
    icon?: string
    /** Contador junto al texto */
    count?: number
}

type ToggleProps<T extends string | number> = {
    options: ToggleOption<NoInfer<T>>[]
    value: T
    onChange: (value: NoInfer<T>) => void
    variant?: "paper" | "light" | "block"
    /** Nombre del campo: si se da, las opciones son radios de formulario */
    name?: string
    /** Etiqueta accesible del grupo */
    label?: string
    className?: string
}

export function Toggle<T extends string | number>({ options, value, onChange, variant = "paper", name, label, className = "" }: ToggleProps<T>) {
    const cls = ["toggle", variant !== "paper" && `toggle--${variant}`, className].filter(Boolean).join(" ")
    const inner = (o: ToggleOption<T>) => (
        <>
            {o.icon ? <i className={`ph ph-${o.icon}`} aria-hidden="true"></i> : null}
            {o.label}
            {o.count !== undefined ? <span className="toggle__count">{o.count}</span> : null}
        </>
    )
    return (
        <div className={cls} role={name ? "radiogroup" : "group"} aria-label={label}>
            {options.map((o) => {
                const active = o.value === value
                return name ? (
                    <label key={String(o.value)} className={`toggle__opt${active ? " is-active" : ""}`}>
                        <input type="radio" name={name} value={String(o.value)} checked={active} onChange={() => onChange(o.value)} />
                        {inner(o)}
                    </label>
                ) : (
                    <button key={String(o.value)} type="button" className={`toggle__opt${active ? " is-active" : ""}`} aria-pressed={active} onClick={() => onChange(o.value)}>
                        {inner(o)}
                    </button>
                )
            })}
        </div>
    )
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function ToggleBlock(props) {
    useAlhambraStyles()
    const { options, variant } = props
    const list: string[] = options?.length ? options : ["Opción 1", "Opción 2"]
    const [value, setValue] = useState(0)
    return (
        <div className={ROOT_CLASS} style={{ display: variant === "block" ? "block" : "inline-block", width: variant === "block" ? "100%" : "auto" }}>
            <Toggle variant={variant} value={value} onChange={setValue} options={list.map((label, i) => ({ value: i, label }))} />
        </div>
    )
}

ToggleBlock.defaultProps = {
    options: ["Auditorio", "Salón"],
    variant: "paper",
}

addPropertyControls(ToggleBlock, {
    options: { type: ControlType.Array, title: "Opciones", control: { type: ControlType.String }, defaultValue: ["Auditorio", "Salón"] },
    variant: {
        type: ControlType.Enum,
        title: "Estilo",
        options: ["paper", "light", "block"],
        optionTitles: ["Papel", "Blanco", "Ancho completo"],
        defaultValue: "paper",
    },
})
