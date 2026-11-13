// Alhambra Shopping — áreas del Salón Auditorio y planos (#areas)
// Escritorio: lista a la izquierda y foto grande que cambia al pasar o
// enfocar cada área. Móvil: cada área lleva su propia foto.
import { useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, Split, ROOT_CLASS, useReveal } from "./Theme.tsx"
import { useCursor, isCanvas } from "./Behaviors.tsx"
import { useLightbox } from "./Lightbox.tsx"
import { Toggle } from "./Toggle.tsx"

const SPACES = [
    { name: "Auditorio", figure: "240", unit: "butacas", text: "Proyector láser Ultra HD 4K, pantalla de 280 pulgadas y sonido surround. Con sillas más delgadas recibe hasta 600 personas.", imageUrl: IMG("GkhOtqCoHc8Qik1hUb2vwTXDyQQ.jpg"), alt: "Auditorio con filas de butacas frente al escenario" },
    { name: "Salón", figure: "600", unit: "personas", text: "Las butacas se abaten y queda una planta libre para cócteles, cenas, fiestas y exposiciones.", imageUrl: IMG("UM2sD2GUl9wDjHpLI1Xy9zN3Xo.jpg"), alt: "Salón libre, con el escenario al fondo y las butacas recogidas" },
    { name: "Foyer", figure: "130", unit: "m²", text: "Antesala de recepción con servicios higiénicos y conexión directa con el rooftop.", imageUrl: IMG("q0xnusR6GTR2nJLnKbo4z8tgak.jpg"), alt: "Foyer de piso de mármol con luces lineales en el techo" },
    { name: "Rooftop", figure: "2.000", unit: "m² aprox.", text: "Terraza al aire libre con vista de sur a norte. Se suma al salón para recepciones y eventos más grandes.", imageUrl: IMG("YMzqjWEORCs5IbHd9zfTaVpNs.jpg") + "?scale-down-to=2048", alt: "Rooftop con jardineras, piso de madera y la cúpula de vidrio" },
]

const PLANS = [
    { name: "Auditorio y foyer", imageUrl: IMG("z57MgQ28Jy5yQ36w2jMvpAT0.jpg"), alt: "Plano del auditorio con escenario, butacas, foyer y servicios higiénicos" },
    { name: "Tercer piso", imageUrl: IMG("tCMYOg99TRlLWOtpFw7UHhNYyYk.jpg"), alt: "Plano completo del tercer piso con el auditorio, el rooftop y las oficinas" },
]

// Neutraface Text no trae «²»: se dibuja como superíndice
const unit = (u: string) =>
    String(u || "").split("²").flatMap((part, i) => (i ? [<sup key={i}>2</sup>, part] : [part]))

const sized = (url: string, w: number) => (url.includes("?") ? url : `${url}?scale-down-to=${w}`)

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function VenueSpaces(props) {
    useAlhambraStyles()
    const { eyebrow, title, lead, spaces, plansTitle, plansText, plans } = props
    const root = useRef<HTMLDivElement>(null)
    const [active, setActive] = useState(0)
    const [plan, setPlan] = useState(0)
    useReveal(root)
    useCursor(root)

    const shots = (plans || []).map((p) => ({ src: sized(p.imageUrl, 1600), full: sized(p.imageUrl, 4096), alt: p.alt, caption: `Plano · ${p.name}` }))
    const lightbox = useLightbox(shots, true)

    const reveal = isCanvas() ? "" : " reveal"
    const list = spaces || []
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            <section className="section venue-spaces" id="areas" aria-labelledby="spaces-title">
                <div className="container">
                    <header className={`discover__head${reveal} reveal--stagger`}>
                        <p className="eyebrow-title eyebrow-title--dark">{eyebrow}</p>
                        <Split className="discover__title" id="spaces-title" text={title} />
                        <p className="discover__lead">{lead}</p>
                    </header>

                    <div className="spaces">
                        <ol className={`spaces__list${reveal}`}>
                            {list.map((s, i) => (
                                <li key={i} className={`space${i === active ? " is-active" : ""}`}>
                                    <button
                                        className="space__btn"
                                        type="button"
                                        aria-pressed={i === active}
                                        onMouseEnter={() => setActive(i)}
                                        onFocus={() => setActive(i)}
                                        onClick={() => setActive(i)}
                                    >
                                        <span className="space__num">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="space__name">{s.name}</span>
                                        <span className="space__figure">
                                            {s.figure} <small>{unit(s.unit)}</small>
                                        </span>
                                    </button>
                                    <p className="space__text">{s.text}</p>
                                    <img className="space__img" src={sized(s.imageUrl, 1200)} alt={s.alt} loading="lazy" />
                                </li>
                            ))}
                        </ol>

                        <div className={`spaces__stage${reveal}`} aria-hidden="true">
                            {list.map((s, i) => (
                                <img key={i} className={i === active ? "is-active" : ""} src={sized(s.imageUrl, 1600)} alt="" loading="lazy" />
                            ))}
                            <div className="spaces__badge">
                                <b>{list[active]?.figure}</b>
                                <span>{unit(list[active]?.unit)} · {list[active]?.name}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`plans${reveal}`}>
                        <div className="plans__head">
                            <div>
                                <h3 className="plans__title">{plansTitle}</h3>
                                <p className="plans__text">{plansText}</p>
                            </div>
                            <Toggle
                                variant="light"
                                label="Plano"
                                value={plan}
                                onChange={setPlan}
                                options={(plans || []).map((p, i) => ({ value: i, label: p.name }))}
                            />
                        </div>
                        <button className="plans__frame" type="button" data-cursor="Ampliar" onClick={() => lightbox.open(plan)} aria-label={`Ampliar plano: ${plans?.[plan]?.name}`}>
                            {(plans || []).map((p, i) => (
                                <img key={i} className={i === plan ? "is-active" : ""} src={sized(p.imageUrl, 1600)} alt={p.alt} loading="lazy" />
                            ))}
                            <span className="plans__zoom" aria-hidden="true"><i className="ph ph-magnifying-glass-plus"></i> Ampliar</span>
                        </button>
                    </div>
                </div>
            </section>
            {lightbox.element}
        </div>
    )
}

VenueSpaces.defaultProps = {
    eyebrow: "Áreas",
    title: "Flexibilidad que se adapta a todo evento",
    lead: "El salón y auditorio se alquila completo, junto con el foyer, y por hora: 600 metros cuadrados en total. Muchos clientes suman el rooftop.",
    spaces: SPACES,
    plansTitle: "Planos",
    plansText: "El auditorio y el foyer están en el piso 3 de la Torre 1 y se conectan con el rooftop.",
    plans: PLANS,
}

addPropertyControls(VenueSpaces, {
    eyebrow: { type: ControlType.String, title: "Antetítulo", defaultValue: VenueSpaces.defaultProps.eyebrow },
    title: { type: ControlType.String, title: "Título", defaultValue: VenueSpaces.defaultProps.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: VenueSpaces.defaultProps.lead },
    spaces: {
        type: ControlType.Array,
        title: "Áreas",
        defaultValue: SPACES,
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Nombre" },
                figure: { type: ControlType.String, title: "Cifra" },
                unit: { type: ControlType.String, title: "Unidad" },
                text: { type: ControlType.String, title: "Texto", displayTextArea: true },
                imageUrl: { type: ControlType.String, title: "Foto (URL)" },
                alt: { type: ControlType.String, title: "Descripción de la foto" },
            },
        },
    },
    plansTitle: { type: ControlType.String, title: "Planos · título", defaultValue: "Planos" },
    plansText: { type: ControlType.String, title: "Planos · texto", displayTextArea: true, defaultValue: VenueSpaces.defaultProps.plansText },
    plans: {
        type: ControlType.Array,
        title: "Planos",
        defaultValue: PLANS,
        control: {
            type: ControlType.Object,
            controls: {
                name: { type: ControlType.String, title: "Nombre" },
                imageUrl: { type: ControlType.String, title: "Imagen (URL)" },
                alt: { type: ControlType.String, title: "Descripción" },
            },
        },
    },
})
