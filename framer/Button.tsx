// Alhambra Shopping — botón de la marca
// Píldora con el texto y el ícono dentro de un círculo (el estilo del botón
// «Enviar» de «Mantente conectado», redondeado). Todos los componentes lo
// importan como { Btn }; la exportación por defecto es la versión para
// arrastrar al lienzo de Framer con sus controles.
//
// Variantes:
//   dark  — oscuro con círculo arena (fondos claros, acción principal)
//   light — crema con círculo arena (sobre fotos u oscuro, acción principal)
//   line  — con borde y círculo crema (fondos claros, acción secundaria)
//   ghost — con borde claro (sobre fotos u oscuro, acción secundaria)
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, ROOT_CLASS } from "./Theme.tsx"

type Variant = "dark" | "light" | "line" | "ghost"

type BtnProps = {
    variant?: Variant
    /** Nombre de un ícono Phosphor; null o "" lo quita */
    icon?: string | null
    /** Ocupa todo el ancho (formularios) */
    block?: boolean
    href?: string
    type?: "button" | "submit" | "reset"
    className?: string
    children?: React.ReactNode
    [rest: string]: any
}

export function Btn({ variant = "dark", icon = "arrow-right", block = false, href, type = "button", className = "", children, ...rest }: BtnProps) {
    const cls = ["btn", `btn--${variant}`, block && "btn--block", !icon && "btn--plain", className].filter(Boolean).join(" ")
    const inner = (
        <>
            <span className="btn__label">{children}</span>
            {icon ? (
                <span className="btn__icon" aria-hidden="true">
                    <i className={`ph ph-${icon}`}></i>
                </span>
            ) : null}
        </>
    )
    return href !== undefined ? (
        <a className={cls} href={href} {...rest}>{inner}</a>
    ) : (
        <button className={cls} type={type} {...rest}>{inner}</button>
    )
}

/**
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function Button(props) {
    useAlhambraStyles()
    const { label, link, variant, icon, block } = props
    return (
        <div className={ROOT_CLASS} style={{ width: block ? "100%" : "auto", display: block ? "block" : "inline-block" }}>
            <Btn variant={variant} icon={icon} block={block} href={link || "#"}>{label}</Btn>
        </div>
    )
}

Button.defaultProps = {
    label: "Ver más",
    link: "",
    variant: "dark",
    icon: "arrow-right",
    block: false,
}

addPropertyControls(Button, {
    label: { type: ControlType.String, title: "Texto", defaultValue: "Ver más" },
    link: { type: ControlType.Link, title: "Enlace" },
    variant: {
        type: ControlType.Enum,
        title: "Estilo",
        options: ["dark", "light", "line", "ghost"],
        optionTitles: ["Oscuro", "Crema", "Borde", "Borde claro"],
        defaultValue: "dark",
    },
    icon: { type: ControlType.String, title: "Ícono", description: "Nombre Phosphor (arrow-right, calendar-plus…). Vacío para quitarlo", defaultValue: "arrow-right" },
    block: { type: ControlType.Boolean, title: "Ancho completo", defaultValue: false },
})
