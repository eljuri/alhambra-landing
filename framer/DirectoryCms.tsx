// Alhambra Shopping — puente entre el CMS de Framer y el directorio
// (colecciones «Marcas» y «Restaurantes»). Funciona igual que EventsCms.tsx:
// 1. En la página va una Collection List de la colección (arriba del todo) y
//    dentro un LocalCMS con cada propiedad conectada a su campo y «Colección»
//    elegida en el panel.
// 2. Cada LocalCMS registra su local en el almacén de esa colección y no
//    dibuja nada en el sitio.
// 3. Brands, Restaurants y Logos (inicio) leen con useCmsLocals(). Si la
//    página no tiene la lista, usan sus datos de ejemplo.
import { addPropertyControls, ControlType } from "framer"
import { isCanvas } from "./Behaviors.tsx"
import { createCmsStore, registerCmsItem, useCmsItems, cmsIndex, type CmsStore } from "./CmsStore.tsx"

export type CollectionName = "marcas" | "restaurantes"

export type CmsLocal = {
    slug: string
    name: string
    categories: string
    photoUrl: string
    logoUrl: string
    faint: boolean
    link: string
    order: number
    home: boolean
}

// --- Almacén (uno por colección) -------------------------------------------

// Orden del campo «Orden»; los que no lo tienen van al final, en el orden de la lista
const byOrder = (store: () => CmsStore<CmsLocal>) => (a: CmsLocal, b: CmsLocal) =>
    (a.order || Infinity) - (b.order || Infinity) || cmsIndex(store(), a.slug) - cmsIndex(store(), b.slug)

const stores: Record<CollectionName, CmsStore<CmsLocal>> = {
    marcas: createCmsStore(byOrder(() => stores.marcas)),
    restaurantes: createCmsStore(byOrder(() => stores.restaurantes)),
}

/** Locales del CMS si hay una Collection List de `collection` en la página; si no, `fallback`. */
export function useCmsLocals<T>(collection: CollectionName, fallback: T[]): (CmsLocal | T)[] {
    return useCmsItems(stores[collection] || stores.marcas, fallback)
}

// --- Componente que va dentro de la Collection List -------------------------

const imageUrl = (v: any) => (v && typeof v === "object" ? v.src || v.url || "" : v || "")

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function LocalCMS(props) {
    const collection: CollectionName = props.collection === "restaurantes" ? "restaurantes" : "marcas"
    const item: CmsLocal = {
        slug: String(props.slug || "").trim(),
        name: props.name || "",
        categories: props.categories || "",
        photoUrl: imageUrl(props.photo),
        logoUrl: imageUrl(props.logo),
        faint: !!props.faint,
        link: props.link || "",
        order: Number(props.order) || 0,
        home: !!props.home,
    }
    // Durante el render, para que el directorio (que va después) ya tenga los
    // datos en el prerender de Framer, sin parpadeo.
    registerCmsItem(stores[collection], item)

    if (!isCanvas()) return null
    return (
        <div style={{ font: "500 11px/1.4 system-ui, sans-serif", color: "#9c8466", padding: "2px 6px" }}>
            CMS · {collection} · {item.name || "(sin nombre)"}
        </div>
    )
}

LocalCMS.displayName = "LocalCMS"

addPropertyControls(LocalCMS, {
    collection: {
        type: ControlType.Enum,
        title: "Colección",
        options: ["marcas", "restaurantes"],
        optionTitles: ["Marcas", "Restaurantes"],
        defaultValue: "marcas",
    },
    slug: { type: ControlType.String, title: "Slug" },
    name: { type: ControlType.String, title: "Nombre" },
    categories: { type: ControlType.String, title: "Categorías" },
    photo: { type: ControlType.ResponsiveImage, title: "Foto" },
    logo: { type: ControlType.ResponsiveImage, title: "Logo" },
    faint: { type: ControlType.Boolean, title: "Logo tenue", defaultValue: false },
    link: { type: ControlType.Link, title: "Enlace" },
    order: { type: ControlType.Number, title: "Orden", defaultValue: 0, displayStepper: true },
    home: { type: ControlType.Boolean, title: "Mostrar en el inicio", defaultValue: false },
})
