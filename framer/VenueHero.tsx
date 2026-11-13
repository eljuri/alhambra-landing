// Alhambra Shopping — hero del Salón Auditorio (/salonauditorio)
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, src, ROOT_CLASS } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"
import { Btn } from "./Button.tsx"

const STATS = [
    { value: "240", label: "butacas abatibles" },
    { value: "600", label: "personas como salón" },
    { value: "600 m²", label: "con foyer incluido" },
    { value: "4K", label: "proyector láser · 280\"" },
]

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function VenueHero(props) {
    useAlhambraStyles()
    const { eyebrow, title, lead, image, imageUrl, cta, ctaLink, cta2, cta2Link, stats } = props
    const intro = isCanvas() ? "" : " intro"
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }}>
            <section className="hero hero--page hero--venue" aria-labelledby="venue-title">
                <img className="hero__bg" src={src(image, imageUrl)} alt="" {...({ fetchpriority: "high" } as any)} />
                <div className="hero__shade" aria-hidden="true"></div>
                <div className="hero__inner container">
                    <div className={`hero__content${intro}`}>
                        <p className="eyebrow-title">
                            <img src={IMG("AQs4AXTCh4L6G4kVfkC6pmpUdcg.svg")} alt="" width={22} height={27} />
                            {eyebrow}
                        </p>
                        <h1 className="hero__title" id="venue-title">{title}</h1>
                        {lead ? <p className="hero__lead">{lead}</p> : null}
                        <div className="hero__actions">
                            <Btn variant="light" href={ctaLink}>{cta}</Btn>
                            <Btn variant="ghost" href={cta2Link}>{cta2}</Btn>
                        </div>
                    </div>
                    <dl className={`venue-stats${intro} intro--late`}>
                        {(stats || []).map((s, i) => (
                            <div className="venue-stats__item" key={i}>
                                <dt>{s.label}</dt>
                                <dd>{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>
        </div>
    )
}

VenueHero.defaultProps = {
    eyebrow: "Salón y Auditorio · Piso 3, Torre 1",
    title: "Donde tú y el lugar son el evento",
    lead: "Un auditorio de 240 butacas que en cinco minutos se convierte en el salón más elegante de Samborondón.",
    imageUrl: IMG("0UTiceOzz00ffIWCwCDUpKrcc84.jpeg"),
    cta: "Reserva tu espacio",
    ctaLink: "#reservas",
    cta2: "Ver áreas y planos",
    cta2Link: "#areas",
    stats: STATS,
}

addPropertyControls(VenueHero, {
    eyebrow: { type: ControlType.String, title: "Antetítulo", defaultValue: VenueHero.defaultProps.eyebrow },
    title: { type: ControlType.String, title: "Título", defaultValue: VenueHero.defaultProps.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: VenueHero.defaultProps.lead },
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    imageUrl: { type: ControlType.String, title: "Imagen (URL)", defaultValue: VenueHero.defaultProps.imageUrl },
    cta: { type: ControlType.String, title: "Botón", defaultValue: VenueHero.defaultProps.cta },
    ctaLink: { type: ControlType.Link, title: "Botón · enlace", defaultValue: VenueHero.defaultProps.ctaLink },
    cta2: { type: ControlType.String, title: "Botón 2", defaultValue: VenueHero.defaultProps.cta2 },
    cta2Link: { type: ControlType.Link, title: "Botón 2 · enlace", defaultValue: VenueHero.defaultProps.cta2Link },
    stats: {
        type: ControlType.Array,
        title: "Cifras",
        maxCount: 4,
        defaultValue: STATS,
        control: {
            type: ControlType.Object,
            controls: {
                value: { type: ControlType.String, title: "Cifra" },
                label: { type: ControlType.String, title: "Texto" },
            },
        },
    },
})
