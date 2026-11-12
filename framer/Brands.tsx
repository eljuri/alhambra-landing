// Alhambra Shopping — directorio de marcas (página /marcas)
// La lógica vive en Directory.tsx; aquí solo están los datos y los controles.
import { addPropertyControls } from "framer"
import { Directory, directoryControls, EMPTY_TEXT } from "./Directory.tsx"

// Fotos y logos: nombres de archivo en framerusercontent.com/images
const ITEMS = [
    { name: "Local 1", categories: "Face Gym, Tratamiento Facial, Cuidado Personal, SPA, Belleza", photoUrl: "kMac0bPT6bBwHz5CRIqLW6GJ2Y.jpg", logoUrl: "8bf7DHVd1QJ6DLbsjK5i5mi604.png" },
    { name: "Local 2", categories: "Accesorios de Moda, Moda Hombre, Sastrería", photoUrl: "KNPUQ8nsxjIp4jVa6NZLxx8YrEY.jpg", logoUrl: "tdeqeVCJSVwHWNfRJUpIcHVeJo.png" },
    { name: "Local 3", categories: "Área Infantil, Entretenimiento", photoUrl: "8EMfpIoTuwUnYXA0vyiiKIe33BI.jpeg", logoUrl: "4NdOLsO3o3SoWbYghYMW9vxKi8.png" },
    { name: "Local 4", categories: "Zapatos, Accesorios de Moda, Moda Hombre, Moda Mujer", photoUrl: "NW4PnMlNLQ7J5N56nNn8QfjlfJI.jpg", logoUrl: "stBMKfpWHtdIRe32MAlqOk3m48.png" },
    { name: "Local 5", categories: "Lavandería en Seco", photoUrl: "mFxseompd0DhsgbOcFsx9et8Uc.jpg", logoUrl: "Wh8jTSQvn6Flellwcs2E5fudX88.png" },
    { name: "Local 6", categories: "Sastrería", photoUrl: "Pywz94c4Pp8JTrIodBZVmldDpM.jpg", logoUrl: "12XxyjuA7uuLp74ctMtfk1N7WQ.png" },
    { name: "Local 7", categories: "Farmacia, Cuidado Personal, Belleza", photoUrl: "p8gN3VW25C4EM0R74FlMNbEx6oM.webp", logoUrl: "nCz8n5M5txSENDwbSRrTg7C6axk.png" },
    { name: "Local 8", categories: "Joyería", photoUrl: "pV4RxrtjDj9nJmuqrfnPJYQw0G4.jpg", logoUrl: "UaD69ctkqtYAcRShykIIVewHc.png" },
    { name: "Local 9", categories: "Área Infantil", photoUrl: "HoY0XR5myzswc81IAfHaFps.jpg", logoUrl: "EeYZM1WITfagtfftczHLWVk2TPU.png" },
    { name: "Local 10", categories: "Peluquería Niños, Peluquería Hombres", photoUrl: "wsHgUTmgjwv8PUwo7mjNV9Fcpg.jpeg", logoUrl: "hNmb2C5QJIoUk5dxxv2yHc5C6o.png" },
    { name: "Local 11", categories: "Cuidado Personal, Perfumería, Belleza", photoUrl: "tX7kQnLiu5gSi7pcgMtUtBwWi0.jpg", logoUrl: "tR0EZRPpq0ypyNoKLdGG078TkE.png" },
    { name: "Local 12", categories: "Cuidado Personal, Tratamiento Facial, SPA, Belleza", photoUrl: "XhqDZgAOrGgBXHJWbWWiMbFFNo8.jpeg", logoUrl: "ir6mM8cb18IdLst8hQSNoT1Wr6o.png" },
    { name: "Local 13", categories: "Tienda de Mascotas", photoUrl: "4Sh0ZSFyfwsnySzFgOjE7BEkxYM.png" },
    { name: "Local 14", categories: "Instrumentos de Escritura, Accesorios de Moda, Relojería", photoUrl: "4GUvAcfEV3AhOzja7ItxDGKUZg.jpg", logoUrl: "BUcjWcwbfnSweYuqM2LCAaJQps.png" },
    { name: "Local 15", categories: "Danza", photoUrl: "Kn5dzPiG3FbIMaN9aQpChkP8.jpg", logoUrl: "NSkvQdOQ2qGX2aBVvalqmNYk.png" },
    { name: "Local 16", categories: "Accesorios de Moda, Joyería, Relojería", photoUrl: "nevzd4p5LDplxDSSJ7JJu0jvJI.jpg", logoUrl: "rQvuJf2VFrRvp2i7F3LkCRNow.png" },
    { name: "Local 17", categories: "Celulares, Electrónica, Electrodomésticos", photoUrl: "d6qtokxosKrC6SsIletaGMnsDA.jpg", logoUrl: "f70BoKLQSx15dHaeXgBHV43KQrQ.png" },
    { name: "Local 18", categories: "Reparación de Relojes", photoUrl: "x8kZZ5brski3bKyqQPFCBq5PIA.jpeg", logoUrl: "2WO841hejj86VpeTq4FCMcUVc.png" },
    { name: "Local 19", categories: "Automóviles", photoUrl: "DSebjSKcseK2FFowNPGqon3T0s.jpeg", logoUrl: "kUG6MvAnKyQuWPPQ8K7IqvUBXv0.png" },
    { name: "Local 20", categories: "Zapatos, Accesorios de Moda, Moda Mujer", photoUrl: "zh37H49Ag39xuU8W1ZRGU2iIwAA.jpeg", logoUrl: "6OLwS9SKoloLo6zCQtpyZZ5QO0A.png" },
    { name: "Local 21", categories: "Licores, Vinos", photoUrl: "BjsqlZYacYywyAypLrTQFLlYM.jpeg", logoUrl: "fe6SmII2vqbcU6B1yPZadogMNs.png" },
    { name: "Local 22", categories: "Deportes, Tenis", photoUrl: "OuDJ0HMfFXMEgslGGLAUNepww.jpeg", logoUrl: "vSLKBFzi8VKNEYrijAU3Z7lcpuA.png" },
    { name: "Local 23", categories: "Accesorios de Moda, Joyería, Relojería", photoUrl: "D29Ygrp6xH6Zi3ITFGeOlO7gYrY.jpg", logoUrl: "kH2PAqQRsJQvNFBQ2IqCWdsv2Og.png" },
    { name: "Local 24", categories: "Hogar, Accesorios de Decoración, Electrodomésticos", photoUrl: "bqPegDF96IzCGcreqBZKCKrpf7A.jpeg", logoUrl: "Wk6EXDEK64sfqN4K44aDd5uyVpY.png", faint: true },
    { name: "Local 25", categories: "Zapatos, Accesorios de Moda, Cuidado Personal, Tienda Departamental, Maletas, Moda Hombre, Electrónica, Computadoras, Moda Mujer, Belleza", photoUrl: "Pa1USRotUuO8uL2RW0lT2r5yunI.jpg", logoUrl: "1vxAhFRaw9KDp9mtW4r4f0D1t9M.png", faint: true },
]

const CATEGORIES = [
    "Moda Mujer", "Moda Hombre", "Zapatos", "Joyería",
    "Belleza", "Hogar", "Tienda de Mascotas", "Deportes",
    "Reparación de Relojes", "Instrumentos de Escritura", "Peluquería Niños", "Peluquería Hombres",
    "Farmacia", "Accesorios de Moda", "Servicios de Decoración", "Cuidado Personal",
    "Tienda Departamental", "Moda Infantil", "Face Gym", "Tratamiento Facial",
    "Arte", "Maletas", "Área Infantil", "Entretenimiento",
    "Accesorios de Decoración", "Muebles", "Celulares", "Electrónica",
    "Computadoras", "Perfumería", "Danza", "Licores",
    "Vinos", "Sastrería", "Florería", "Tenis",
    "SPA", "Cuidado Persona", "Lavandería en Seco", "Automóviles",
    "Electrodomésticos", "Relojería",
]

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Brands(props) {
    return <Directory {...props} gridId="shopping-grid" square={false} searchLabel="Buscar marcas" chipsLabel="Categorías de productos" alt="Logo" />
}

Brands.defaultProps = {
    eyebrow: "Directorio",
    sub: "Categorías de productos",
    placeholder: "Busca una tienda o categoría",
    categories: CATEGORIES,
    mainChips: 6,
    items: ITEMS,
    emptyText: EMPTY_TEXT,
}

addPropertyControls(Brands, directoryControls(Brands.defaultProps))
