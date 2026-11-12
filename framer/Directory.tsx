// Alhambra Shopping — directorio con buscador y chips de categoría
// (Marcas y Restaurantes). Portado de main.js: el buscador se suma al chip
// activo y una tarjeta se ve si cumple ambos. Las categorías después de las
// primeras quedan plegadas tras «Ver todas».
// Este archivo no es un componente: lo usan Brands.tsx y Restaurants.tsx.
import { useMemo, useRef, useState } from "react"
import { ControlType } from "framer"
import { useAlhambraStyles, IMG, src, ROOT_CLASS, useReveal } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"

export type DirectoryItem = {
    name: string
    categories: string
    photo?: any
    photoUrl?: string
    logo?: any
    logoUrl?: string
    faint?: boolean
}

// Minúsculas y sin tildes, para que «cafeteria» encuentre «Cafetería»
const normalize = (text: string) =>
    text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim()

// Nombre de archivo en framerusercontent o URL completa
const asset = (value?: string) => (value ? (/^https?:/.test(value) ? value : IMG(value)) : "")

const splitCats = (value: string) =>
    String(value || "").split(/\s*[|,]\s*/).filter(Boolean)

export function Directory(props) {
    useAlhambraStyles()
    const {
        gridId, square, eyebrow, sub, searchLabel, placeholder, chipsLabel,
        categories, mainChips, items, emptyText, alt,
    } = props
    const root = useRef<HTMLDivElement>(null)
    const [category, setCategory] = useState<string | null>(null)
    const [query, setQuery] = useState("")
    const [open, setOpen] = useState(false)
    useReveal(root)

    const cats: string[] = useMemo(() => splitCats((categories || []).join("|")), [categories])
    const list: Array<DirectoryItem & { cats: string[]; haystack: string }> = useMemo(
        () =>
            (items || []).map((item) => {
                const itemCats = splitCats(item.categories)
                return { ...item, cats: itemCats, haystack: normalize([item.name || "", ...itemCats].join(" ")) }
            }),
        [items]
    )

    const q = normalize(query)
    const shown = list.map((item) =>
        (category === null || item.cats.includes(category)) && (q === "" || item.haystack.includes(q))
    )
    const visible = shown.filter(Boolean).length
    const hasExtras = cats.length > mainChips
    const reveal = isCanvas() ? "" : " reveal"

    const chip = (label: string, value: string | null, extra = false, all = false) => (
        <li key={label} {...(extra ? { "data-extra": "" } : {})}>
            <button
                type="button"
                className={`chip${all ? " chip--all" : ""}`}
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
            >
                {label}
            </button>
        </li>
    )

    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            {/* Pasa a negro sólido los logos con trazo semitransparente */}
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
                <filter id="logo-ink" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3 0" />
                </filter>
            </svg>

            <section className="section directory" id="directorio" aria-labelledby={`${gridId}-title`}>
                <div className="container">
                    <header className={`section__head${reveal} reveal--stagger`}>
                        <h2 className="eyebrow-title eyebrow-title--dark" id={`${gridId}-title`}>
                            <img src={IMG("A1ojXZTXGa5odrog3kpK2BxSGnk.svg")} alt="" width={26} height={32} /> {eyebrow}
                        </h2>
                        <p className="section__sub">{sub}</p>
                    </header>

                    <div className={`search${reveal}`} role="search">
                        <label className="visually-hidden" htmlFor={`search-${gridId}`}>{searchLabel}</label>
                        <div className="search__control">
                            <i className="ph ph-magnifying-glass" aria-hidden="true"></i>
                            <input
                                id={`search-${gridId}`}
                                type="search"
                                placeholder={placeholder}
                                autoComplete="off"
                                spellCheck={false}
                                maxLength={60}
                                aria-controls={gridId}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <ul className={`chips is-interactive${hasExtras && !open ? " is-collapsed" : ""}${reveal}`} aria-label={chipsLabel}>
                        {chip("Todas", null, false, true)}
                        {cats.map((c, i) => chip(c, c, i >= mainChips))}
                        {hasExtras ? (
                            <li className="chips__more">
                                <button type="button" className="chip chip--more" aria-expanded={open} onClick={() => setOpen(!open)}>
                                    <span>{open ? "Ver menos" : `Ver todas (${cats.length})`}</span>
                                    <i className={open ? "ph ph-minus" : "ph ph-plus"} aria-hidden="true"></i>
                                </button>
                            </li>
                        ) : null}
                    </ul>

                    <ul className={`grid${square ? " grid--square" : ""}`} id={gridId}>
                        {list.map((item, i) => {
                            const logo = src(item.logo, asset(item.logoUrl))
                            return (
                                <li
                                    className={`card${logo ? "" : " card--nologo"}${reveal}`}
                                    key={i}
                                    hidden={!shown[i]}
                                    style={{ ["--delay" as any]: `${(i % 4) * 0.08}s` }}
                                >
                                    <figure className="card__photo">
                                        <img src={src(item.photo, asset(item.photoUrl))} alt={item.name} loading="lazy" decoding="async" />
                                    </figure>
                                    {logo ? (
                                        <div className={`card__logo${item.faint ? " card__logo--faint" : ""}`}>
                                            <img src={logo} alt={`${alt} ${item.name}`} loading="lazy" />
                                        </div>
                                    ) : null}
                                </li>
                            )
                        })}
                    </ul>
                    <p className="search__empty" aria-live="polite">{visible === 0 ? emptyText : ""}</p>
                </div>
            </section>
        </div>
    )
}

// Controles comunes; cada página aporta sus valores por defecto
export function directoryControls(defaults) {
    return {
        eyebrow: { type: ControlType.String, title: "Etiqueta", defaultValue: defaults.eyebrow },
        sub: { type: ControlType.String, title: "Título", defaultValue: defaults.sub },
        placeholder: { type: ControlType.String, title: "Buscador", defaultValue: defaults.placeholder },
        categories: {
            type: ControlType.Array,
            title: "Categorías",
            control: { type: ControlType.String },
            defaultValue: defaults.categories,
        },
        mainChips: {
            type: ControlType.Number,
            title: "Categorías visibles",
            description: "Las demás quedan tras «Ver todas»",
            min: 0, max: 40, step: 1, displayStepper: true,
            defaultValue: defaults.mainChips,
        },
        items: {
            type: ControlType.Array,
            title: "Locales",
            control: {
                type: ControlType.Object,
                controls: {
                    name: { type: ControlType.String, title: "Nombre" },
                    categories: { type: ControlType.String, title: "Categorías", description: "Separadas por coma, iguales a las de arriba" },
                    photo: { type: ControlType.ResponsiveImage, title: "Foto" },
                    photoUrl: { type: ControlType.String, title: "Foto (archivo)" },
                    logo: { type: ControlType.ResponsiveImage, title: "Logo" },
                    logoUrl: { type: ControlType.String, title: "Logo (archivo)" },
                    faint: { type: ControlType.Boolean, title: "Logo tenue", description: "Lo pasa a negro sólido", defaultValue: false },
                },
            },
            defaultValue: defaults.items,
        },
        emptyText: { type: ControlType.String, title: "Sin resultados", displayTextArea: true, defaultValue: defaults.emptyText },
    }
}

export const EMPTY_TEXT = "No encontramos resultados. Prueba con otra palabra o elige «Todas»."
