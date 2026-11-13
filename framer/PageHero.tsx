// Alhambra Shopping — hero de páginas internas (Marcas, Restaurantes)
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, REPO, src, ROOT_CLASS } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function PageHero(props) {
    useAlhambraStyles()
    const { title, lead, image, imageUrl } = props
    const intro = isCanvas() ? "" : " intro"
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }}>
            <section className="hero hero--page" aria-labelledby="page-title">
                <img className="hero__bg" src={src(image, imageUrl)} alt="" {...({ fetchpriority: "high" } as any)} />
                <div className="hero__shade" aria-hidden="true"></div>
                <div className="hero__inner container">
                    <div className={`hero__content${intro}`}>
                        <img className="hero__mark" src={IMG("AQs4AXTCh4L6G4kVfkC6pmpUdcg.svg")} alt="" width={26} height={32} />
                        <h1 className="hero__title" id="page-title">{title}</h1>
                        {lead ? <p className="hero__lead">{lead}</p> : null}
                    </div>
                </div>
            </section>
        </div>
    )
}

PageHero.defaultProps = {
    title: "Marcas",
    lead: "Moda, belleza, hogar y servicios en un solo lugar.",
    imageUrl: `${REPO}/imagenes/hero/marcas.jpeg`,
}

// Para Restaurantes: título «Restaurantes», texto «Cocina de autor, cafés y
// sobremesas largas.» e imagen ${REPO}/imagenes/hero/comidas.jpeg
export const RESTAURANTS_HERO = {
    title: "Restaurantes",
    lead: "Cocina de autor, cafés y sobremesas largas.",
    imageUrl: `${REPO}/imagenes/hero/comidas.jpeg`,
}

addPropertyControls(PageHero, {
    title: { type: ControlType.String, title: "Título", defaultValue: PageHero.defaultProps.title },
    lead: { type: ControlType.String, title: "Texto", displayTextArea: true, defaultValue: PageHero.defaultProps.lead },
    image: { type: ControlType.ResponsiveImage, title: "Imagen" },
    imageUrl: { type: ControlType.String, title: "Imagen (URL)", defaultValue: PageHero.defaultProps.imageUrl },
})
