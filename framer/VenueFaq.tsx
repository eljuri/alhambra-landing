// Alhambra Shopping — preguntas frecuentes del Salón Auditorio
// <details> nativo: funciona sin JS y con teclado; con name="…" solo queda
// una respuesta abierta a la vez en los navegadores que lo soportan.
import { useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, Split, ROOT_CLASS, useReveal } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"
import { Btn } from "./Button.tsx"

const QUESTIONS = [
    { q: "¿Es auditorio o salón de eventos?", a: "Las dos cosas. Gracias a las butacas abatibles automáticas, el auditorio se convierte en salón en 5 minutos, de forma totalmente automática." },
    { q: "¿Dónde está ubicado?", a: "En el piso 3 de la Torre 1 de Alhambra, en la Vía a Samborondón y Celeste Blacio de Rendón." },
    { q: "¿Cuál es el área completa?", a: "El salón y auditorio se alquila completo, junto con el foyer o antesala, y por hora. El espacio total es de 600 metros cuadrados. Muchos clientes suman el rooftop, que agrega cerca de 2.000 metros cuadrados." },
    { q: "¿Qué capacidad tiene como auditorio?", a: "240 butacas propias. Con sillas más delgadas la capacidad llega hasta 600 personas." },
    { q: "¿Qué capacidad tiene como salón?", a: "Aproximadamente 600 personas de pie." },
    { q: "¿Se conectan el auditorio y el rooftop?", a: "Sí. El salón y auditorio se conecta con el foyer, y el foyer con el rooftop de Alhambra." },
    { q: "¿Brindan servicio de catering o licor?", a: "Alhambra no brinda catering ni alimentos, pero te compartimos una lista de proveedores con los que trabajamos." },
    { q: "¿Qué tipo de eventos se realizan?", a: "Eventos personales como matrimonios y cumpleaños, talleres y charlas, seminarios, maestrías, eventos corporativos, lanzamientos de productos, conferencias, convenciones y películas, entre otros." },
    { q: "Mi evento es un concierto al aire libre, ¿puedo realizarlo?", a: "Sí, aunque Alhambra cuida de no molestar al entorno: todo evento debe mantener un volumen máximo de 60 dB." },
]

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function VenueFaq(props) {
    useAlhambraStyles()
    const { eyebrow, title, lead, cta, ctaLink, questions } = props
    const root = useRef<HTMLDivElement>(null)
    useReveal(root)
    const reveal = isCanvas() ? "" : " reveal"
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            <section className="section venue-faq" id="preguntas" aria-labelledby="faq-title">
                <div className="container venue-faq__grid">
                    <header className={`venue-faq__head${reveal} reveal--stagger`}>
                        <p className="eyebrow-title eyebrow-title--dark">{eyebrow}</p>
                        <Split className="discover__title" id="faq-title" text={title} />
                        <p className="discover__lead">{lead}</p>
                        <Btn variant="line" href={ctaLink}>{cta}</Btn>
                    </header>
                    <div className={`faq${reveal}`}>
                        {(questions || []).map((item, i) => (
                            <details className="faq__item" name="venue-faq" key={i} open={i === 0}>
                                <summary className="faq__q">
                                    <span>{item.q}</span>
                                    <i className="faq__icon" aria-hidden="true"></i>
                                </summary>
                                <p className="faq__a">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

VenueFaq.defaultProps = {
    eyebrow: "Antes de reservar",
    title: "Preguntas frecuentes",
    lead: "Lo que más nos preguntan sobre capacidad, áreas y servicios.",
    cta: "Solicitar reserva",
    ctaLink: "#reservas",
    questions: QUESTIONS,
}

addPropertyControls(VenueFaq, {
    eyebrow: { type: ControlType.String, title: "Antetítulo", defaultValue: VenueFaq.defaultProps.eyebrow },
    title: { type: ControlType.String, title: "Título", defaultValue: VenueFaq.defaultProps.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: VenueFaq.defaultProps.lead },
    cta: { type: ControlType.String, title: "Botón", defaultValue: VenueFaq.defaultProps.cta },
    ctaLink: { type: ControlType.Link, title: "Botón · enlace", defaultValue: "#reservas" },
    questions: {
        type: ControlType.Array,
        title: "Preguntas",
        defaultValue: QUESTIONS,
        control: {
            type: ControlType.Object,
            controls: {
                q: { type: ControlType.String, title: "Pregunta" },
                a: { type: ControlType.String, title: "Respuesta", displayTextArea: true },
            },
        },
    },
})
