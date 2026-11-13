// Alhambra Shopping — visor de fotos a pantalla completa (código compartido,
// no es un componente). Lo usan VenueGallery y VenueSpaces (planos).
// <dialog> nativo: atrapa el foco, cierra con Esc y lo devuelve al abrir.
import { useEffect, useRef, useState } from "react"

export type Shot = { src: string; full?: string; alt: string; caption?: string }

export function useLightbox(items: Shot[], zoomable = false) {
    const dialog = useRef<HTMLDialogElement>(null)
    const stage = useRef<HTMLDivElement>(null)
    const [index, setIndex] = useState(0)
    const [zoom, setZoom] = useState<null | { x: number; y: number }>(null)
    const count = items.length
    const item = items[Math.min(index, count - 1)]

    const open = (i: number) => {
        setIndex(i)
        setZoom(null)
        const d = dialog.current
        if (!d || d.open) return
        d.showModal()
        document.documentElement.style.overflow = "hidden"
    }
    const close = () => dialog.current?.close()
    const step = (dir: number) => {
        setZoom(null)
        setIndex((i) => (i + dir + count) % count)
    }

    // Al ampliar, el punto donde se hizo clic queda al centro
    useEffect(() => {
        const box = stage.current
        if (!box || !zoom) return
        box.scrollLeft = zoom.x * box.scrollWidth - box.clientWidth / 2
        box.scrollTop = zoom.y * box.scrollHeight - box.clientHeight / 2
    }, [zoom])

    const onImage = (e: React.MouseEvent<HTMLImageElement>) => {
        if (!zoomable) return
        if (zoom) return setZoom(null)
        const r = e.currentTarget.getBoundingClientRect()
        setZoom({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
    }

    const onKey = (e: React.KeyboardEvent) => {
        if (count < 2) return
        if (e.key === "ArrowRight") step(1)
        if (e.key === "ArrowLeft") step(-1)
    }

    const element = (
        <dialog
            className="lightbox"
            ref={dialog}
            aria-label={item?.caption || item?.alt}
            onKeyDown={onKey}
            onClose={() => document.documentElement.style.removeProperty("overflow")}
            onClick={(e) => e.target === e.currentTarget && close()}
        >
            {item ? (
                <figure className="lightbox__figure">
                    <div className={`lightbox__stage${zoom ? " is-zoomed" : ""}${zoomable ? " is-zoomable" : ""}`} ref={stage}>
                        <img key={item.src} className="lightbox__img" src={item.full || item.src} alt={item.alt} onClick={onImage} />
                    </div>
                    <figcaption className="lightbox__caption">
                        <span>{item.caption || item.alt}</span>
                        {zoomable ? <span className="lightbox__hint">{zoom ? "Clic para alejar" : "Clic en el plano para ampliar"}</span> : null}
                        {count > 1 ? <span className="lightbox__count">{index + 1} / {count}</span> : null}
                    </figcaption>
                </figure>
            ) : null}
            <button className="lightbox__btn lightbox__close" type="button" onClick={close} aria-label="Cerrar">
                <i className="ph ph-x" aria-hidden="true"></i>
            </button>
            {count > 1 ? (
                <>
                    <button className="lightbox__btn lightbox__prev" type="button" onClick={() => step(-1)} aria-label="Anterior">
                        <i className="ph ph-arrow-left" aria-hidden="true"></i>
                    </button>
                    <button className="lightbox__btn lightbox__next" type="button" onClick={() => step(1)} aria-label="Siguiente">
                        <i className="ph ph-arrow-right" aria-hidden="true"></i>
                    </button>
                </>
            ) : null}
        </dialog>
    )

    return { open, element }
}
