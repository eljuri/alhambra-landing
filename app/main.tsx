// Sitio en local: las mismas secciones que viven en Framer, con sus valores
// por defecto (defaultProps). Cada ruta equivale a una página de Framer.
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import Nav from "../framer/Nav.tsx"
import Hero from "../framer/Hero.tsx"
import Ribbon from "../framer/Ribbon.tsx"
import Events from "../framer/Events.tsx"
import Discover from "../framer/Discover.tsx"
import Subscribe from "../framer/Subscribe.tsx"
import Logos from "../framer/Logos.tsx"
import Footer from "../framer/Footer.tsx"
import PageHero from "../framer/PageHero.tsx"
import RestaurantsHero from "../framer/RestaurantsHero.tsx"
import Brands from "../framer/Brands.tsx"
import Restaurants from "../framer/Restaurants.tsx"

const PAGES = {
    "/": {
        title: "Alhambra Shopping",
        intro: true,
        body: (
            <>
                <Hero />
                <Ribbon />
                <Events />
                <Discover />
                <Subscribe />
                <Logos />
            </>
        ),
    },
    "/marcas": {
        title: "Marcas · Alhambra Shopping",
        intro: false,
        body: (
            <>
                <PageHero />
                <Brands />
            </>
        ),
    },
    "/restaurantes": {
        title: "Restaurantes · Alhambra Shopping",
        intro: false,
        body: (
            <>
                <RestaurantsHero />
                <Restaurants />
            </>
        ),
    },
}

const page = PAGES[location.pathname.replace(/\/$/, "") || "/"] ?? PAGES["/"]
document.title = page.title

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Nav animateIntro={page.intro} />
        <main id="contenido">{page.body}</main>
        <Footer />
    </StrictMode>
)
