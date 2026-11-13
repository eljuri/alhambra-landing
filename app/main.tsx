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
import EventsHero from "../framer/EventsHero.tsx"
import EventsAgenda, { EVENTS } from "../framer/EventsAgenda.tsx"
import EventDetail from "../framer/EventDetail.tsx"
import VenueHero from "../framer/VenueHero.tsx"
import VenueShift from "../framer/VenueShift.tsx"
import VenueSpaces from "../framer/VenueSpaces.tsx"
import VenueGallery from "../framer/VenueGallery.tsx"
import VenueFaq from "../framer/VenueFaq.tsx"
import VenueBooking from "../framer/VenueBooking.tsx"

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
    "/eventos": {
        title: "Eventos · Alhambra Shopping",
        intro: false,
        body: (
            <>
                <EventsHero />
                <EventsAgenda />
            </>
        ),
    },
    "/salonauditorio": {
        title: "Salón Auditorio · Alhambra Shopping",
        intro: false,
        body: (
            <>
                <VenueHero />
                <VenueShift />
                <VenueSpaces />
                <VenueGallery />
                <VenueFaq />
                <VenueBooking />
            </>
        ),
    },
}

// /eventos/<slug>: en Framer es la página CMS; aquí sale de los eventos de ejemplo,
// con los mismos valores que entregaría el CMS (fecha de Ecuador escrita en UTC).
function eventPage(path: string) {
    const slug = decodeURIComponent(path.match(/^\/eventos\/([^/]+)$/)?.[1] || "")
    const e = EVENTS.find((x) => x.slug === slug)
    if (!e) return null
    const [s1, s2, s3] = String(e.sponsors || "").split(",").map((u) => u.trim())
    const date = e.date.includes("T") ? `${e.date}:00Z` : `${e.date}T00:00:00Z`
    return {
        title: `${e.title} · Alhambra Shopping`,
        intro: false,
        body: (
            <EventDetail
                {...EventDetail.defaultProps}
                {...e}
                date={date}
                image={e.imageUrl}
                extra={e.extraUrl}
                sponsor1={s1}
                sponsor2={s2}
                sponsor3={s3}
            />
        ),
    }
}

const path = location.pathname.replace(/\/$/, "") || "/"
const page = PAGES[path] ?? eventPage(path) ?? PAGES["/"]
document.title = page.title

// Sin CMS en local: los puentes no esperan a la Collection List (ver CmsStore.tsx)
;(window as any).__ALHAMBRA_LOCAL__ = true

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Nav animateIntro={page.intro} />
        <main id="contenido">{page.body}</main>
        <Footer />
    </StrictMode>
)
