// Alhambra Shopping — página de la Política de Protección de Datos Personales
// (/politica-de-datos). El texto está en PolicyText.tsx; aquí solo el diseño:
// franja oscura con versión y descarga del PDF, índice fijo (plegable en
// celular) y las 19 secciones con ancla propia (#derechos, #tratamientos…).
import { Fragment, useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, ROOT_CLASS } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"
import { POLICY, POLICY_META, type PolicyBlock } from "./PolicyText.tsx"

// PDF original en un commit fijo del repo (jsDelivr)
const PDF_URL = "https://cdn.jsdelivr.net/gh/eljuri/alhambra-landing@7f5583d6434dc35282ea02d6699b64f3ff79fc98/cdn/politica-datos-personales.pdf"

const paras = (text: string) => text.split(/\n{2,}/)

function Block({ b }: { b: PolicyBlock }) {
    if ("p" in b) return <p>{b.p}</p>
    if ("ol" in b) return <ol className="policy__list">{b.ol.map((x, i) => <li key={i}>{x}</li>)}</ol>
    if ("ul" in b) return <ul className="policy__list policy__list--plain">{b.ul.map((x, i) => <li key={i}>{x}</li>)}</ul>
    if ("defs" in b)
        return (
            <dl className="policy__defs">
                {b.defs.map(([term, text], i) => (
                    <div key={i}>
                        <dt>{term}</dt>
                        <dd>{paras(text).map((p, j) => <p key={j}>{p}</p>)}</dd>
                    </div>
                ))}
            </dl>
        )
    if ("contact" in b)
        return (
            <dl className="policy__contact">
                {b.contact.map(([label, value, href], i) => (
                    <div key={i}>
                        <dt>{label}</dt>
                        <dd>{href ? <a href={href}>{value}</a> : value}</dd>
                    </div>
                ))}
            </dl>
        )
    if ("tables" in b)
        return (
            <div className="policy__tables">
                {b.tables.map((t, i) => (
                    <section className="policy__table" key={i} aria-labelledby={`policy-t${i}`}>
                        <h3 id={`policy-t${i}`}>{t.who}</h3>
                        {t.groups.map((g, j) => (
                            <div className="policy__group" key={j}>
                                <p className="policy__base"><span>Base de legitimación</span>{g.base}</p>
                                <dl>
                                    {g.items.map(([name, purpose], k) => (
                                        <div key={k}>
                                            <dt>{name}</dt>
                                            <dd>{purpose}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ))}
                    </section>
                ))}
            </div>
        )
    return null
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Policy(props) {
    useAlhambraStyles()
    const { eyebrow, title, updated, pdf, pdfUrl, rightsLabel } = props
    const pdfHref = pdf || pdfUrl
    const [active, setActive] = useState(POLICY[0].id)
    // Índice abierto en el HTML del servidor; en celular se pliega al cargar
    const [tocOpen, setTocOpen] = useState(true)

    useEffect(() => {
        if (isCanvas()) return
        if (matchMedia("(max-width: 960px)").matches) setTocOpen(false)
        const els = POLICY.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
        const io = new IntersectionObserver(
            (entries) => {
                const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
                if (hit) setActive(hit.target.id)
            },
            { rootMargin: "-20% 0px -70% 0px" }
        )
        els.forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [])

    const onToc = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        if (isCanvas()) return
        const el = document.getElementById(id)
        if (!el) return
        e.preventDefault()
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        history.replaceState(history.state, "", `#${id}`)
        setActive(id)
        if (matchMedia("(max-width: 960px)").matches) setTocOpen(false)
    }

    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }}>
            <header className="ev-page__head policy__head">
                <div className="container">
                    <p className="policy__eyebrow">{eyebrow}</p>
                    <h1 className="policy__title">{title}</h1>
                    <p className="policy__company">{POLICY_META.company}</p>
                    <ul className="policy__meta">
                        <li>Versión {POLICY_META.version}</li>
                        <li>Código {POLICY_META.code}</li>
                        {updated ? <li>{updated}</li> : null}
                    </ul>
                    <div className="policy__actions">
                        {pdfHref ? (
                            <a className="policy__btn" href={pdfHref} target="_blank" rel="noopener noreferrer">
                                <i className="ph ph-file-pdf" aria-hidden="true"></i> Descargar PDF
                            </a>
                        ) : null}
                        <a className="policy__btn policy__btn--line" href={`mailto:${POLICY_META.email}`}>
                            <i className="ph ph-envelope-simple" aria-hidden="true"></i> {rightsLabel}
                        </a>
                    </div>
                </div>
            </header>

            <div className="section policy__main">
                <div className="container policy__grid">
                    <aside className="policy__aside">
                        <details className="policy__toc" open={tocOpen} onToggle={(e) => setTocOpen((e.target as HTMLDetailsElement).open)}>
                            <summary>
                                Contenido <i className="ph ph-caret-down" aria-hidden="true"></i>
                            </summary>
                            <nav aria-label="Contenido de la política">
                                <ol>
                                    {POLICY.map((s) => (
                                        <li key={s.id}>
                                            <a href={`#${s.id}`} className={active === s.id ? "is-active" : undefined} aria-current={active === s.id ? "true" : undefined} onClick={(e) => onToc(e, s.id)}>
                                                {s.title}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </details>
                    </aside>

                    <article className="policy__body">
                        {POLICY.map((s, i) => (
                            <section className="policy__section" id={s.id} key={s.id} aria-labelledby={`${s.id}-h`}>
                                <h2 id={`${s.id}-h`}>
                                    <span className="policy__num">{i + 1}</span>
                                    {s.title}
                                </h2>
                                {s.blocks.map((b, j) => (
                                    <Fragment key={j}>
                                        <Block b={b} />
                                    </Fragment>
                                ))}
                            </section>
                        ))}
                    </article>
                </div>
            </div>
        </div>
    )
}

Policy.displayName = "Policy"

Policy.defaultProps = {
    eyebrow: "Legal",
    title: "Política de Protección de Datos Personales",
    updated: "Actualizada el 9 de septiembre de 2026",
    pdfUrl: PDF_URL,
    rightsLabel: "Ejercer mis derechos",
}

addPropertyControls(Policy, {
    eyebrow: { type: ControlType.String, title: "Antetítulo", defaultValue: Policy.defaultProps.eyebrow },
    title: { type: ControlType.String, title: "Título", defaultValue: Policy.defaultProps.title },
    updated: { type: ControlType.String, title: "Actualización", defaultValue: Policy.defaultProps.updated },
    pdf: { type: ControlType.File, title: "PDF", allowedFileTypes: ["pdf"] },
    pdfUrl: { type: ControlType.String, title: "PDF (URL)", defaultValue: Policy.defaultProps.pdfUrl },
    rightsLabel: { type: ControlType.String, title: "Botón derechos", defaultValue: Policy.defaultProps.rightsLabel },
})
