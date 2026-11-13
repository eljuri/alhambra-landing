// Alhambra Shopping — hero de /restaurantes: PageHero con sus propios valores
import { addPropertyControls, ControlType } from "framer"
import PageHero, { RESTAURANTS_HERO } from "./PageHero.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function RestaurantsHero(props) {
    return <PageHero {...props} />
}

RestaurantsHero.defaultProps = RESTAURANTS_HERO

addPropertyControls(RestaurantsHero, {
    title: { type: ControlType.String, title: "Título", defaultValue: RESTAURANTS_HERO.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: RESTAURANTS_HERO.lead },
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    imageUrl: { type: ControlType.String, title: "Imagen (URL)", defaultValue: RESTAURANTS_HERO.imageUrl },
})
