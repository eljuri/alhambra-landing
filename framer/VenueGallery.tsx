// Alhambra Shopping — «Eventos pasados» del Salón Auditorio: mosaico de fotos
// que se abren a pantalla completa (Lightbox.tsx)
import { useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, Split, ROOT_CLASS, useReveal } from "./Theme.tsx"
import { useCursor, isCanvas } from "./Behaviors.tsx"
import { useLightbox } from "./Lightbox.tsx"

const EVENTS = [
    { name: "Cena navideña", kind: "Social", imageUrl: IMG("0UTiceOzz00ffIWCwCDUpKrcc84.jpeg"), alt: "Mesas vestidas de blanco con centros de mesa altos en el salón" },
    { name: "Lanzamiento de producto", kind: "Corporativo", imageUrl: IMG("c4RekPnAcDHaTgIsPtCLCGImfE.jpeg"), alt: "Auditorio lleno durante la presentación de un producto" },
    { name: "Graduación · Escuela de belleza", kind: "Educativo", imageUrl: IMG("WQEwX4u3VAZuwd6isoqtJqp9Zg.jpeg"), alt: "Graduandos con toga y estola amarilla sentados en el auditorio" },
    { name: "Brunch corporativo · CEES", kind: "Corporativo", imageUrl: IMG("MiCUvANSZMhfJ40sdf178IC1Rs.jpeg"), alt: "Presentadores en el escenario frente a la pantalla" },
    { name: "Conferencia en el auditorio", kind: "Educativo", imageUrl: IMG("U84VK3R2w0hdxwQ3sNCwrq9k4ao.jpeg") + "?scale-down-to=2048", alt: "Conferencista en el escenario frente a un público atento" },
]

const KINDS = [
    "Matrimonios", "Cumpleaños", "Talleres y charlas", "Seminarios", "Maestrías",
    "Eventos corporativos", "Lanzamientos", "Conferencias", "Convenciones", "Películas",
]

const sized = (url: string, w: number) => (url.includes("?") ? url : `${url}?scale-down-to=${w}`)

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function VenueGallery(props) {
    useAlhambraStyles()
    const { eyebrow, title, lead, events, kinds, cursorLabel } = props
    const root = useRef<HTMLDivElement>(null)
    useReveal(root)
    useCursor(root)

    const list = events || []
    const lightbox = useLightbox(list.map((e) => ({ src: sized(e.imageUrl, 2048), alt: e.alt, caption: `${e.name} · ${e.kind}` })))

    const reveal = isCanvas() ? "" : " reveal"
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            <section className="section venue-gallery" aria-labelledby="gallery-title">
                <div className="container">
                    <header className={`venue-gallery__head${reveal} reveal--stagger`}>
                        <p className="eyebrow-title">{eyebrow}</p>
                        <Split className="discover__title" id="gallery-title" text={title} />
                        <p className="discover__lead">{lead}</p>
                    </header>

                    <ul className="venue-gallery__grid">
                        {list.map((e, i) => (
                            <li className={`shot${reveal}`} key={i} style={{ ["--delay" as any]: `${(i % 3) * 0.08}s` }}>
                                <button className="shot__btn" type="button" data-cursor={cursorLabel} onClick={() => lightbox.open(i)}>
                                    <img src={sized(e.imageUrl, 1400)} alt={e.alt} loading="lazy" />
                                    <span className="shot__info">
                                        <span className="shot__kind">{e.kind}</span>
                                        <span className="shot__name">{e.name}</span>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>

                    <ul className={`venue-kinds${reveal}`} aria-label="Tipos de eventos">
                        {(kinds || []).map((k, i) => <li key={i}>{k}</li>)}
                    </ul>
                </div>
            </section>
            {lightbox.element}
        </div>
    )
}

VenueGallery.defaultProps = {
    eyebrow: "Eventos pasados",
    title: "Aquí ya pasaron grandes momentos",
    lead: "Alhambra ha sido el lugar de los eventos más importantes de nuestros clientes: sociales, corporativos y educativos.",
    events: EVENTS,
    kinds: KINDS,
    cursorLabel: "Ver",
}

addPropertyControls(VenueGallery, {
    eyebrow: { type: ControlType.String, title: "Antetítulo", defaultValue: VenueGallery.defaultProps.eyebrow },
    title: { type: ControlType.String, title: "Título", defaultValue: VenueGallery.defaultProps.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: VenueGallery.defaultProps.lead },
    events: {
        type: ControlType.Array,
        title: "Eventos",
        defaultValue: EVENTS,
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Nombre" },
                kind: { type: ControlType.String, title: "Tipo" },
                imageUrl: { type: ControlType.String, title: "Foto (URL)" },
                alt: { type: ControlType.String, title: "Descripción de la foto" },
            },
        },
    },
    kinds: { type: ControlType.Array, title: "Tipos de eventos", defaultValue: KINDS, control: { type: ControlType.String } },
    cursorLabel: { type: ControlType.String, title: "Cursor", defaultValue: "Ver" },
})
