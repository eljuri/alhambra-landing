// Alhambra Shopping — almacén compartido entre los puentes del CMS
// (EventoCMS, LocalCMS) y las secciones que los leen.
//
// Por qué espera: al generar el HTML, la Collection List carga sus datos de
// forma asíncrona, así que React pinta la sección antes de que los puentes se
// registren y el HTML salía con los datos de ejemplo (y luego el navegador los
// cambiaba: parpadeo y errores de hidratación). Por eso, mientras el almacén
// esté vacío, la sección se suspende hasta que llegue el primer elemento o
// pase un tiempo límite (páginas sin Collection List). En el editor no espera.
import { useEffect, useState } from "react"
import { isCanvas } from "./Behaviors.tsx"

export type CmsStore<T extends { slug: string }> = {
    items: Map<string, T>
    seq: Map<string, number>
    snapshot: T[] | null
    sort?: (a: T, b: T) => number
    settled: boolean
    waiter: Promise<void> | null
    wake: (() => void) | null
}

const listeners = new Set<() => void>()
let version = 0
let queued = false
const notify = () => {
    if (queued) return
    queued = true
    Promise.resolve().then(() => {
        queued = false
        version++
        listeners.forEach((l) => l())
    })
}

export function createCmsStore<T extends { slug: string }>(sort?: (a: T, b: T) => number): CmsStore<T> {
    return { items: new Map(), seq: new Map(), snapshot: null, sort, settled: false, waiter: null, wake: null }
}

const same = (a: object, b: object) => Object.keys(a).every((k) => a[k] === b[k])

/** Lo llama el puente durante su render. */
export function registerCmsItem<T extends { slug: string }>(store: CmsStore<T>, item: T) {
    if (!item.slug) return
    const prev = store.items.get(item.slug)
    if (prev && same(prev, item)) return
    if (!store.seq.has(item.slug)) store.seq.set(item.slug, store.seq.size)
    store.items.set(item.slug, item)
    store.snapshot = null
    settle(store)
    notify()
}

/** Posición en la Collection List, para desempatar al ordenar. */
export const cmsIndex = (store: CmsStore<any>, slug: string) => store.seq.get(slug) ?? 0

function settle(store: CmsStore<any>) {
    store.settled = true
    store.wake?.()
    store.wake = null
    store.waiter = null
}

// En el servidor la lista suele tardar milisegundos; el límite solo corre en
// páginas que no la tienen.
const LIMIT_MS = typeof window === "undefined" ? 1500 : 800

function wait(store: CmsStore<any>): Promise<void> {
    return (store.waiter ??= new Promise<void>((resolve) => {
        store.wake = resolve
        setTimeout(() => settle(store), LIMIT_MS)
    }))
}

// La app local (Vite) no tiene CMS: no hay nada que esperar.
const isLocalApp = () => typeof window !== "undefined" && !!(window as any).__ALHAMBRA_LOCAL__

/** Elementos del CMS si la página tiene la Collection List; si no, `fallback`. */
export function useCmsItems<T extends { slug: string }, F>(store: CmsStore<T>, fallback: F[]): (T | F)[] {
    const [, setV] = useState(version)
    useEffect(() => {
        const l = () => setV(version)
        listeners.add(l)
        l()
        return () => {
            listeners.delete(l)
        }
    }, [])
    if (!store.items.size) {
        if (!store.settled && !isCanvas() && !isLocalApp()) throw wait(store)
        return fallback
    }
    if (!store.snapshot) {
        const list = Array.from(store.items.values())
        store.snapshot = store.sort ? list.sort(store.sort) : list
    }
    return store.snapshot
}
