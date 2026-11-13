// Alhambra Shopping — puente entre el CMS de Framer y los componentes de eventos.
//
// Framer no deja que un code component lea una colección directamente, así que:
// 1. En la página se pone una Collection List de «Eventos» (arriba del todo) y
//    dentro un EventoCMS con cada propiedad conectada a su campo del CMS.
// 2. Cada EventoCMS registra su evento en un almacén compartido y no dibuja nada.
// 3. EventsAgenda y Events leen ese almacén con useCmsEvents(). Si está vacío
//    (no hay Collection List) usan sus eventos de ejemplo.
import { addPropertyControls, ControlType } from "framer"
import { isCanvas } from "./Behaviors.tsx"
import { createCmsStore, registerCmsItem, useCmsItems } from "./CmsStore.tsx"

export type CmsEvent = {
    slug: string
    title: string
    date: string // «AAAA-MM-DD» o «AAAA-MM-DDTHH:MM», hora de Ecuador
    time: string
    tag: string
    place: string
    summary: string
    body: string
    imageUrl: string
    extraUrl: string
    sponsors: string // URLs separadas por coma
    register: boolean
    free: boolean
    linkLabel: string
}

// --- Almacén ---------------------------------------------------------------

const store = createCmsStore<CmsEvent>()

/** Eventos del CMS si hay una Collection List en la página; si no, `fallback`. */
export function useCmsEvents<T>(fallback: T[]): (CmsEvent | T)[] {
    return useCmsItems(store, fallback)
}

// --- Conversión de los valores que entrega Framer --------------------------

const pad = (n: number) => String(n).padStart(2, "0")

// El CMS guarda la hora de Ecuador tal cual (sin zona), así que se leen las
// partes en UTC para no desplazarla según el navegador del visitante.
function wallTime(value: any): string {
    if (!value) return ""
    const d = value instanceof Date ? value : new Date(value)
    if (isNaN(+d)) return ""
    const day = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
    const h = d.getUTCHours(), m = d.getUTCMinutes()
    return h || m ? `${day}T${pad(h)}:${pad(m)}` : day
}

const imageUrl = (v: any) => (v && typeof v === "object" ? v.src || v.url || "" : v || "")

// Texto enriquecido (HTML) → párrafos separados por línea en blanco
function plainText(v: any): string {
    const html = String(v ?? "")
    if (!/[<&]/.test(html)) return html.trim()
    return html
        .replace(/<\/(p|h[1-6]|li|blockquote)>/gi, "\n\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}

// --- Componente que va dentro de la Collection List -------------------------

/** Valores de Framer (fecha, imágenes, texto) → evento. También lo usa EventDetail. */
export function toCmsEvent(props): CmsEvent {
    return {
        slug: String(props.slug || "").trim(),
        title: props.title || "",
        date: wallTime(props.date),
        time: props.time || "",
        tag: props.tag || "",
        place: props.place || "",
        summary: props.summary || "",
        body: plainText(props.body),
        imageUrl: imageUrl(props.image),
        extraUrl: imageUrl(props.extra),
        sponsors: [props.sponsor1, props.sponsor2, props.sponsor3].map(imageUrl).filter(Boolean).join(", "),
        register: !!props.register,
        free: !!props.free,
        linkLabel: props.linkLabel || "",
    }
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function EventoCMS(props) {
    const ev = toCmsEvent(props)
    // Se registra durante el render para que la agenda (que va después en la
    // página) ya tenga los datos en el prerender de Framer, sin parpadeo.
    registerCmsItem(store, ev)

    if (!isCanvas()) return null
    return (
        <div style={{ font: "500 11px/1.4 system-ui, sans-serif", color: "#9c8466", padding: "2px 6px" }}>
            CMS · {ev.title || "(sin título)"} · {ev.date || "sin fecha"}
        </div>
    )
}

EventoCMS.displayName = "EventoCMS"

export const EVENT_FIELD_CONTROLS = {
    slug: { type: ControlType.String, title: "Slug" },
    title: { type: ControlType.String, title: "Título" },
    date: { type: ControlType.Date, title: "Fecha" },
    time: { type: ControlType.String, title: "Horario" },
    tag: { type: ControlType.String, title: "Etiqueta" },
    place: { type: ControlType.String, title: "Lugar" },
    summary: { type: ControlType.String, title: "Resumen" },
    body: { type: ControlType.String, title: "Descripción", displayTextArea: true },
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    extra: { type: ControlType.ResponsiveImage, title: "Imagen extra" },
    sponsor1: { type: ControlType.ResponsiveImage, title: "Auspiciante 1" },
    sponsor2: { type: ControlType.ResponsiveImage, title: "Auspiciante 2" },
    sponsor3: { type: ControlType.ResponsiveImage, title: "Auspiciante 3" },
    register: { type: ControlType.Boolean, title: "Tiene registro", defaultValue: false },
    free: { type: ControlType.Boolean, title: "Gratis", defaultValue: false },
    linkLabel: { type: ControlType.String, title: "Texto del botón" },
}

addPropertyControls(EventoCMS, EVENT_FIELD_CONTROLS)
