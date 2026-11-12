// Alhambra Shopping — footer
import { Fragment, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, src, ROOT_CLASS } from "./Theme.tsx"

const NOSOTROS = [
    { label: "Ubicación", link: "/ubicacion" },
    { label: "Oficinas", link: "/oficinas" },
    { label: "Salón Auditorio", link: "/salonauditorio" },
    { label: "Contacto", link: "/contacto" },
]
const EXPLORAR = [
    { label: "Marcas", link: "/marcas" },
    { label: "Restaurantes", link: "/restaurantes" },
    { label: "Eventos", link: "/eventos" },
    { label: "Blog", link: "/blog" },
]
const HOURS = [
    { label: "Centro Comercial", text: "Lunes a domingo: 10h00 a 21h00" },
    { label: "Restaurantes", text: "Lunes a domingo: hasta las 23h00" },
    { label: "Oficinas administrativas", text: "Lunes a viernes: 08h30 a 17h30" },
]

const ext = { target: "_blank", rel: "noopener noreferrer" }

function Links({ items }) {
    return (
        <>
            {(items || []).map((l, i) => (
                <a className="footer__link" href={l.link} key={i}>
                    <i className="ph ph-arrow-circle-right" aria-hidden="true"></i>
                    {l.label}
                </a>
            ))}
        </>
    )
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Footer(props) {
    useAlhambraStyles()
    const p = props
    const input = useRef<HTMLInputElement>(null)

    // Lleva el email al formulario completo de la página de inicio
    const onSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        const email = input.current?.value.trim() || ""
        const section = document.getElementById("suscripcion")
        if (!section) {
            location.href = `/${email ? `?email=${encodeURIComponent(email)}` : ""}#suscripcion`
            return
        }
        const target = document.getElementById("f-email") as HTMLInputElement | null
        if (target && email) target.value = email
        section.scrollIntoView({ behavior: "smooth", block: "start" })
        ;(document.getElementById("f-nombres") as HTMLInputElement | null)?.focus({ preventScroll: true })
    }

    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }}>
            <footer className="footer">
                <div className="container">
                    <div className="footer__row footer__row--top">
                        <div className="footer__item">
                            <h2 className="footer__title">Síguenos</h2>
                            <ul className="footer__social">
                                {p.instagram ? <li><a href={p.instagram} {...ext} aria-label="Instagram de Alhambra (abre en una pestaña nueva)"><i className="ph ph-instagram-logo" aria-hidden="true"></i></a></li> : null}
                                {p.facebook ? <li><a href={p.facebook} {...ext} aria-label="Facebook de Alhambra (abre en una pestaña nueva)"><i className="ph ph-facebook-logo" aria-hidden="true"></i></a></li> : null}
                                {p.tiktok ? <li><a href={p.tiktok} {...ext} aria-label="TikTok de Alhambra (abre en una pestaña nueva)"><i className="ph ph-tiktok-logo" aria-hidden="true"></i></a></li> : null}
                            </ul>
                        </div>
                        <div className="footer__item">
                            <h2 className="footer__title">Nuestros centros</h2>
                            <div className="footer__brands">
                                <img src={src(p.logo, IMG("HcVAk9C7PnJQR0x6m7aF7pGBwI.png"))} alt="Alhambra" width={232} height={324} loading="lazy" />
                                <a href={p.costaPlaza} {...ext} aria-label="Costa Plaza (abre en una pestaña nueva)">
                                    <img src={IMG("IId5KRdEMNy0J9srei1GHS3PVco.svg")} alt="Costa Plaza" width={38} height={42} loading="lazy" />
                                </a>
                            </div>
                        </div>
                        <div className="footer__item">
                            <h2 className="footer__title" id="f-suscribete">Suscríbete</h2>
                            <form className="footer__subscribe" aria-labelledby="f-suscribete" noValidate onSubmit={onSubscribe}>
                                <label className="visually-hidden" htmlFor="ff-email">Email</label>
                                <input id="ff-email" ref={input} type="email" name="email" placeholder="Ingresa tu email" autoComplete="email" spellCheck={false} maxLength={120} />
                                <button type="submit" aria-label="Continuar suscripción"><i className="ph ph-arrow-right" aria-hidden="true"></i></button>
                            </form>
                        </div>
                    </div>

                    <div className="footer__row footer__row--center">
                        <nav className="footer__item" aria-label="Enlaces del sitio">
                            <h2 className="footer__title">Nosotros</h2>
                            <Links items={p.nosotros} />
                            <h2 className="footer__title footer__title--next">Explorar</h2>
                            <Links items={p.explorar} />
                        </nav>

                        <div className="footer__item">
                            <h2 className="footer__title">Horarios de atención</h2>
                            {(p.hours || []).map((h, i) => (
                                <Fragment key={i}>
                                    <p className="footer__label">{h.label}</p>
                                    <p>{h.text}</p>
                                </Fragment>
                            ))}
                        </div>

                        <div className="footer__item">
                            <h2 className="footer__title">Contáctanos</h2>
                            <p>Teléfono: <a href={`tel:${p.phoneLink}`}>{p.phone}</a></p>
                            <a className="footer__link" href={p.contactLink}><i className="ph ph-arrow-circle-right" aria-hidden="true"></i>Escríbenos</a>
                        </div>

                        <div className="footer__item">
                            <h2 className="footer__title">Visítanos</h2>
                            <address>{p.address}</address>
                            <a className="footer__link" href={p.mapLink} {...ext}><i className="ph ph-arrow-circle-right" aria-hidden="true"></i>Ver mapa</a>
                        </div>
                    </div>

                    <p className="footer__legal">{p.legal}</p>

                    <div className="footer__row footer__row--bottom">
                        <p>{p.copyright}</p>
                        <p>{p.company}</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

Footer.defaultProps = {
    instagram: "https://www.instagram.com/alhambraplaza",
    facebook: "https://www.facebook.com/alhambrashopping",
    tiktok: "https://www.tiktok.com/@alhambrashopping",
    costaPlaza: "https://www.costa-plaza.com/",
    nosotros: NOSOTROS,
    explorar: EXPLORAR,
    hours: HOURS,
    phone: "(04) 600-5220",
    phoneLink: "+59346005220",
    contactLink: "/contacto",
    address: "Vía a Samborondón y Celeste Blacio de Rendón, Samborondón – Ecuador",
    mapLink: "https://maps.app.goo.gl/J7jprExU6aCsafxE7",
    legal: "Alhambra Shopping, Alhambra, Costa Plaza, las marcas, colores y signos distintivos, logotipos y colores son marcas registradas de Inmobiliaria Cobilhambra S.A. Los demás son de propiedad y derecho de sus respectivos propietarios. La información en este sitio es informativa e ilustrativa y sujeta a cambios.",
    copyright: "© 2026 Alhambra Shopping. Todos los derechos reservados.",
    company: "Inmobiliaria Cobilhambra S.A.",
}

const linkList = (title: string, def) => ({
    type: ControlType.Array,
    title,
    control: {
        type: ControlType.Object,
        controls: { label: { type: ControlType.String, title: "Texto" }, link: { type: ControlType.Link, title: "Enlace" } },
    },
    defaultValue: def,
})
const d = Footer.defaultProps

addPropertyControls(Footer, {
    logo: { type: ControlType.ResponsiveImage, title: "Logo" },
    instagram: { type: ControlType.Link, title: "Instagram", defaultValue: d.instagram },
    facebook: { type: ControlType.Link, title: "Facebook", defaultValue: d.facebook },
    tiktok: { type: ControlType.Link, title: "TikTok", defaultValue: d.tiktok },
    costaPlaza: { type: ControlType.Link, title: "Costa Plaza", defaultValue: d.costaPlaza },
    nosotros: linkList("Nosotros", NOSOTROS),
    explorar: linkList("Explorar", EXPLORAR),
    hours: {
        type: ControlType.Array,
        title: "Horarios",
        control: {
            type: ControlType.Object,
            controls: { label: { type: ControlType.String, title: "Lugar" }, text: { type: ControlType.String, title: "Horario" } },
        },
        defaultValue: HOURS,
    },
    phone: { type: ControlType.String, title: "Teléfono", defaultValue: d.phone },
    phoneLink: { type: ControlType.String, title: "Teléfono (marcado)", defaultValue: d.phoneLink },
    contactLink: { type: ControlType.Link, title: "Escríbenos", defaultValue: d.contactLink },
    address: { type: ControlType.String, title: "Dirección", displayTextArea: true, defaultValue: d.address },
    mapLink: { type: ControlType.Link, title: "Mapa", defaultValue: d.mapLink },
    legal: { type: ControlType.String, title: "Texto legal", displayTextArea: true, defaultValue: d.legal },
    copyright: { type: ControlType.String, title: "Copyright", defaultValue: d.copyright },
    company: { type: ControlType.String, title: "Empresa", defaultValue: d.company },
})
