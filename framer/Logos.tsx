// Alhambra Shopping — cifras + dos filas de logos en movimiento sobre una foto fija
import { useEffect, useRef, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, IMG, src, ROOT_CLASS, useReveal, reduceMotion } from "./Theme.tsx"
import { isCanvas } from "./Behaviors.tsx"
import { useCmsLocals, type CmsLocal } from "./DirectoryCms.tsx"

const L = (name: string, w: number, h: number, faint = false) => ({ imageUrl: IMG(name), width: w, height: h, faint })
const BRANDS = [
    L("8bf7DHVd1QJ6DLbsjK5i5mi604.png", 156, 88), L("tdeqeVCJSVwHWNfRJUpIcHVeJo.png", 175, 25), L("4NdOLsO3o3SoWbYghYMW9vxKi8.png", 159, 96),
    L("stBMKfpWHtdIRe32MAlqOk3m48.png", 478, 52), L("Wh8jTSQvn6Flellwcs2E5fudX88.png", 226, 40), L("12XxyjuA7uuLp74ctMtfk1N7WQ.png", 164, 55),
    L("nCz8n5M5txSENDwbSRrTg7C6axk.png", 174, 57), L("UaD69ctkqtYAcRShykIIVewHc.png", 146, 66), L("EeYZM1WITfagtfftczHLWVk2TPU.png", 140, 88),
    L("hNmb2C5QJIoUk5dxxv2yHc5C6o.png", 120, 58), L("tR0EZRPpq0ypyNoKLdGG078TkE.png", 180, 61), L("ir6mM8cb18IdLst8hQSNoT1Wr6o.png", 226, 71),
    L("BUcjWcwbfnSweYuqM2LCAaJQps.png", 226, 28), L("NSkvQdOQ2qGX2aBVvalqmNYk.png", 159, 84), L("rQvuJf2VFrRvp2i7F3LkCRNow.png", 226, 86),
    L("f70BoKLQSx15dHaeXgBHV43KQrQ.png", 226, 36), L("2WO841hejj86VpeTq4FCMcUVc.png", 223, 160), L("kUG6MvAnKyQuWPPQ8K7IqvUBXv0.png", 180, 53),
    L("6OLwS9SKoloLo6zCQtpyZZ5QO0A.png", 389, 139), L("fe6SmII2vqbcU6B1yPZadogMNs.png", 186, 67), L("vSLKBFzi8VKNEYrijAU3Z7lcpuA.png", 201, 61),
    L("kH2PAqQRsJQvNFBQ2IqCWdsv2Og.png", 500, 160), L("Wk6EXDEK64sfqN4K44aDd5uyVpY.png", 226, 85, true), L("1vxAhFRaw9KDp9mtW4r4f0D1t9M.png", 382, 160, true),
]
const RESTAURANTS = [
    L("lDZrqzOuzHtm3iejve55iVnJw.png", 94, 96), L("yAwPrRkR3bD5VeX8gBeJfdWc.png", 225, 29), L("E0t4ob96kI9w4SRiAj5xmgXDz5Y.png", 220, 48),
    L("PStisN1WOjMW9ozrm7ZbMcwXYI.png", 226, 76), L("RiVwOGWnWcGiXfUfAJKmfoDDHo.png", 358, 160), L("hzPWJZ6Xck05EmfjnRDebDIzFE.png", 529, 142),
    L("lC26F97ZzURvoSFOw6Z97h9m8jA.png", 531, 151), L("98pLEPqYlxGPK63FOvdPNs4PmDk.png", 220, 79), L("O4vBnESSprdmfvUmtGrw5Jf7U.png", 219, 63),
]
const SPEED = 40 // px por segundo

// Los logos anchos se achican y los cuadrados crecen: misma presencia visual
const k = (w: number, h: number) => {
    const ratio = w && h ? w / h : 2.5
    return Math.min(Math.max(ratio ** -0.42, 0.34), 1).toFixed(3)
}

// Locales del CMS marcados «Mostrar en el inicio» (y con logo) → logos de la fila.
// Sin Collection List en la página, la fila usa los logos del panel.
function useRowLogos(collection: "marcas" | "restaurantes", fallback: any[]) {
    const items = useCmsLocals<never>(collection, []) as CmsLocal[]
    const fromCms = items.filter((l) => l.home && l.logoUrl)
    if (!fromCms.length) return fallback
    // Sin ancho/alto: las medidas que da el CMS no son fiables (muchas vienen
    // como 240×131); la escala se calcula con la imagen real al cargar.
    return fromCms.map((l) => ({ imageUrl: l.logoUrl, width: 0, height: 0, faint: l.faint, alt: l.name }))
}

// Los PNG vienen centrados en un lienzo transparente (p. ej. 240×131), así que
// sin medidas a mano (logos del CMS) se mide el área visible del dibujo.
const trimCache = new Map<string, Promise<[number, number]>>()
function visibleSize(url: string): Promise<[number, number]> {
    let p = trimCache.get(url)
    if (!p) {
        p = new Promise((resolve) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => {
                const w = img.naturalWidth, h = img.naturalHeight
                try {
                    const c = document.createElement("canvas")
                    c.width = w
                    c.height = h
                    const ctx = c.getContext("2d")!
                    ctx.drawImage(img, 0, 0)
                    const data = ctx.getImageData(0, 0, w, h).data
                    let x0 = w, y0 = h, x1 = -1, y1 = -1
                    for (let y = 0; y < h; y++)
                        for (let x = 0; x < w; x++)
                            if (data[(y * w + x) * 4 + 3] > 16) {
                                if (x < x0) x0 = x
                                if (x > x1) x1 = x
                                if (y < y0) y0 = y
                                if (y > y1) y1 = y
                            }
                    resolve(x1 < 0 ? [w, h] : [x1 - x0 + 1, y1 - y0 + 1])
                } catch {
                    resolve([w, h])
                }
            }
            img.onerror = () => resolve([0, 0])
            img.src = url
        })
        trimCache.set(url, p)
    }
    return p
}

const fitOnLoad = (e) => {
    const img = e.currentTarget as HTMLImageElement
    if (img.getAttribute("width") || !img.currentSrc) return
    visibleSize(img.currentSrc).then(([w, h]) => w && img.style.setProperty("--k", k(w, h)))
}

function Marquee({ label, logos, reverse }) {
    const box = useRef<HTMLDivElement>(null)
    const track = useRef<HTMLUListElement>(null)
    const [reps, setReps] = useState(1)
    const [duration, setDuration] = useState(0)

    // Repite hasta cubrir el ancho y duplica una vez más para el bucle a -50%
    useEffect(() => {
        const measure = () => {
            const el = track.current, wrap = box.current
            if (!el || !wrap) return
            const one = el.scrollWidth / (reps * 2)
            if (!one) return
            const need = Math.min(Math.max(Math.ceil(wrap.clientWidth / one), 1), 20)
            setReps(need)
            setDuration((one * need) / SPEED)
        }
        if (document.readyState === "complete") measure()
        else window.addEventListener("load", measure, { once: true })
        const imgs = Array.from(track.current?.querySelectorAll("img") || [])
        // Las que ya cargaron antes de hidratar no disparan onLoad
        imgs.forEach((img) => (img.complete ? fitOnLoad({ currentTarget: img }) : img.addEventListener("load", measure, { once: true })))
        let width = window.innerWidth
        const onResize = () => {
            if (window.innerWidth === width) return
            width = window.innerWidth
            measure()
        }
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [logos])

    const items = Array.from({ length: reps * 2 }, () => logos).flat()
    const ready = duration > 0 && !isCanvas()
    return (
        <div
            className={`marquee${reverse ? " marquee--reverse" : ""}${ready ? " is-ready" : ""}`}
            ref={box}
            style={ready ? ({ ["--marquee-duration" as any]: `${duration}s` }) : undefined}
        >
            <ul className="marquee__track" aria-label={label} ref={track}>
                {items.map((l, i) => (
                    <li key={i} className={l.faint ? "marquee__item--faint" : undefined} aria-hidden={i >= logos.length ? "true" : undefined}>
                        <img
                            src={src(l.image, l.imageUrl)}
                            alt={l.alt || ""}
                            width={l.width || undefined}
                            height={l.height || undefined}
                            onLoad={fitOnLoad}
                            loading="lazy"
                            decoding="async"
                            style={{ ["--k" as any]: k(l.width, l.height) }}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

function Count({ value, delay }) {
    const ref = useRef<HTMLSpanElement>(null)
    const [shown, setShown] = useState(value)
    useEffect(() => {
        const el = ref.current
        if (!el || reduceMotion() || isCanvas() || !("IntersectionObserver" in window)) return
        setShown(0)
        const DURATION = 1800
        const easeOut = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t))
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            io.disconnect()
            let start = 0
            const step = (now: number) => {
                if (!start) start = now + delay
                const t = Math.min(Math.max((now - start) / DURATION, 0), 1)
                setShown(Math.round(easeOut(t) * value))
                if (t < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
        }, { threshold: 0.6 })
        io.observe(el)
        return () => io.disconnect()
    }, [value])
    return (
        <span className="logos__num" data-count={value} ref={ref}>
            <span>{shown}</span>
        </span>
    )
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Logos(props) {
    useAlhambraStyles()
    const { background, backgroundUrl, brands, restaurants, categories, days, brandLogos, restaurantLogos,
        brandsLabel, brandsLink, brandsLinkLabel, restLabel, restLink, restLinkLabel } = props
    const root = useRef<HTMLDivElement>(null)
    useReveal(root)
    const brandRow = useRowLogos("marcas", brandLogos || [])
    const restRow = useRowLogos("restaurantes", restaurantLogos || [])

    // Al hacer scroll las filas aceleran con la velocidad; al subir, giran al revés
    useEffect(() => {
        const host = root.current
        if (!host || reduceMotion() || isCanvas()) return
        let lastY = window.scrollY, velocity = 0, running = false
        const setRate = (rate: number) =>
            host.querySelectorAll(".marquee__track").forEach((t) =>
                (t as HTMLElement).getAnimations().forEach((a) => { a.playbackRate = rate })
            )
        const tick = () => {
            const y = window.scrollY
            velocity = velocity * 0.88 + (y - lastY) * 0.12
            lastY = y
            if (Math.abs(velocity) > 0.05) {
                setRate(1 + Math.max(-3, Math.min(4, velocity * 0.3)))
                requestAnimationFrame(tick)
            } else {
                velocity = 0
                setRate(1)
                running = false
            }
        }
        const kick = () => {
            if (running) return
            running = true
            requestAnimationFrame(tick)
        }
        window.addEventListener("scroll", kick, { passive: true })
        return () => window.removeEventListener("scroll", kick)
    }, [])

    const reveal = isCanvas() ? "" : " reveal"
    // En el lienzo la foto no puede ser fija: se muestra como fondo normal
    const bgStyle = isCanvas() ? ({ position: "absolute", height: "100%" } as const) : undefined
    return (
        <div className={ROOT_CLASS} style={{ width: "100%" }} ref={root}>
            {/* Pasa a cream sólido los logos con trazo semitransparente */}
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
                <filter id="logo-cream" colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0 0 0 0 0.96  0 0 0 0 0.94  0 0 0 0 0.91  0 0 0 3 0" />
                </filter>
            </svg>
            <section className="section logos" id="directorio" aria-label="Marcas y restaurantes">
                <div className="logos__stage">
                    <img className="logos__bg" src={src(background, backgroundUrl)} alt="" decoding="async" style={bgStyle} />
                    <div className="logos__veil" aria-hidden="true"></div>
                    <div className="container">
                        <h2 className={`logos__title${reveal} reveal--stagger`}>
                            <span className="logos__line">
                                <Count value={brands} delay={0} /> marcas, <Count value={restaurants} delay={120} /> restaurantes y{" "}
                                <Count value={categories} delay={240} /> categorías,
                            </span>
                            <span className="logos__line">
                                abiertos los <Count value={days} delay={360} /> días de la semana.
                            </span>
                        </h2>
                    </div>

                    <div className={`logo-row${reveal}`}>
                        <div className="container logo-row__head">
                            <h3 className="logo-row__label">{brandsLabel}</h3>
                            <a className="logo-row__link" href={brandsLink}>
                                {brandsLinkLabel} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                            </a>
                        </div>
                        <Marquee label={brandsLabel} logos={brandRow} reverse={false} />
                    </div>

                    <div className={`logo-row${reveal}`}>
                        <div className="container logo-row__head">
                            <h3 className="logo-row__label">{restLabel}</h3>
                            <a className="logo-row__link" href={restLink}>
                                {restLinkLabel} <i className="ph ph-arrow-right" aria-hidden="true"></i>
                            </a>
                        </div>
                        <Marquee label={restLabel} logos={restRow} reverse={true} />
                    </div>
                </div>
            </section>
        </div>
    )
}

Logos.defaultProps = {
    backgroundUrl: IMG("UhdlIoRsfWHJRucJxnnM1PmPo.jpg"),
    brands: 25, restaurants: 9, categories: 42, days: 7,
    brandLogos: BRANDS, restaurantLogos: RESTAURANTS,
    brandsLabel: "Marcas", brandsLink: "/marcas", brandsLinkLabel: "Ver todas las marcas",
    restLabel: "Restaurantes", restLink: "/restaurantes", restLinkLabel: "Ver todos los restaurantes",
}

const logoControl = {
    type: ControlType.Object,
    controls: {
        image: { type: ControlType.ResponsiveImage, title: "Logo" },
        imageUrl: { type: ControlType.String, title: "Logo (URL)" },
        alt: { type: ControlType.String, title: "Nombre" },
        width: { type: ControlType.Number, title: "Ancho original", defaultValue: 200 },
        height: { type: ControlType.Number, title: "Alto original", defaultValue: 60 },
        faint: { type: ControlType.Boolean, title: "Trazo tenue", defaultValue: false },
    },
}

addPropertyControls(Logos, {
    background: { type: ControlType.ResponsiveImage, title: "Fondo" },
    backgroundUrl: { type: ControlType.String, title: "Fondo (URL)", defaultValue: Logos.defaultProps.backgroundUrl },
    brands: { type: ControlType.Number, title: "Nº marcas", defaultValue: 25, displayStepper: true },
    restaurants: { type: ControlType.Number, title: "Nº restaurantes", defaultValue: 9, displayStepper: true },
    categories: { type: ControlType.Number, title: "Nº categorías", defaultValue: 42, displayStepper: true },
    days: { type: ControlType.Number, title: "Días abiertos", defaultValue: 7, displayStepper: true },
    brandsLabel: { type: ControlType.String, title: "Fila 1 · título", defaultValue: "Marcas" },
    brandsLinkLabel: { type: ControlType.String, title: "Fila 1 · enlace", defaultValue: "Ver todas las marcas" },
    brandsLink: { type: ControlType.Link, title: "Fila 1 · URL", defaultValue: "/marcas" },
    brandLogos: { type: ControlType.Array, title: "Fila 1 · logos", control: logoControl, defaultValue: BRANDS },
    restLabel: { type: ControlType.String, title: "Fila 2 · título", defaultValue: "Restaurantes" },
    restLinkLabel: { type: ControlType.String, title: "Fila 2 · enlace", defaultValue: "Ver todos los restaurantes" },
    restLink: { type: ControlType.Link, title: "Fila 2 · URL", defaultValue: "/restaurantes" },
    restaurantLogos: { type: ControlType.Array, title: "Fila 2 · logos", control: logoControl, defaultValue: RESTAURANTS },
})
