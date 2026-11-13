// Alhambra Shopping — hero de /eventos: PageHero con sus propios valores
import { addPropertyControls, ControlType } from "framer"
import PageHero from "./PageHero.tsx"
import { IMG } from "./Theme.tsx"

const EVENTS_HERO = {
    title: "Eventos",
    lead: "Vive cada momento en Alhambra: música, bienestar, ferias y fechas especiales.",
    imageUrl: IMG("GDUyFdQmdNCJHE0E1d6iQbMpeBA.webp"),
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function EventsHero(props) {
    return <PageHero {...props} />
}

EventsHero.defaultProps = EVENTS_HERO

addPropertyControls(EventsHero, {
    title: { type: ControlType.String, title: "Título", defaultValue: EVENTS_HERO.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: EVENTS_HERO.lead },
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    imageUrl: { type: ControlType.String, title: "Imagen (URL)", defaultValue: EVENTS_HERO.imageUrl },
})
