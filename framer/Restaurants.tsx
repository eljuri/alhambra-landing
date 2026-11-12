// Alhambra Shopping — directorio de restaurantes (página /restaurantes)
// La lógica vive en Directory.tsx; aquí solo están los datos y los controles.
import { addPropertyControls } from "framer"
import { Directory, directoryControls, EMPTY_TEXT } from "./Directory.tsx"

// Fotos y logos: nombres de archivo en framerusercontent.com/images
const ITEMS = [
    { name: "Restaurante 1", categories: "Deli market", photoUrl: "zJKv8NwLmyTagDcvg9AHZt5Sz4I.jpeg", logoUrl: "lDZrqzOuzHtm3iejve55iVnJw.png" },
    { name: "Restaurante 2", categories: "Carnes y Parrilla", photoUrl: "R0gtDIhFLgBO7vaZD69B0rJDcY.png", logoUrl: "yAwPrRkR3bD5VeX8gBeJfdWc.png" },
    { name: "Restaurante 3", categories: "Japonesa", photoUrl: "v1A4HFZUGJIb6ySiFtaUa1sCc.jpg", logoUrl: "E0t4ob96kI9w4SRiAj5xmgXDz5Y.png" },
    { name: "Restaurante 4", categories: "Italiana", photoUrl: "agXOqY7MQjJCRIkasuNMcHQV54.png", logoUrl: "PStisN1WOjMW9ozrm7ZbMcwXYI.png" },
    { name: "Restaurante 5", categories: "Peruana", photoUrl: "8IPc5A6YI1Mtl31PxqkAvMYqBg.jpeg", logoUrl: "RiVwOGWnWcGiXfUfAJKmfoDDHo.png" },
    { name: "Restaurante 6", categories: "Mexicana", photoUrl: "U1mkjqg9TuBsLlEVfmsl17wg8j8.jpg", logoUrl: "hzPWJZ6Xck05EmfjnRDebDIzFE.png" },
    { name: "Restaurante 7", categories: "Panadería", photoUrl: "d1QB4FiJJ33naslIG3XIv0MsTNw.jpeg", logoUrl: "lC26F97ZzURvoSFOw6Z97h9m8jA.png" },
    { name: "Restaurante 8", categories: "Vinos y Licores", photoUrl: "TToM42xFjUoZAx9Vv59HbzITP0.jpeg", logoUrl: "98pLEPqYlxGPK63FOvdPNs4PmDk.png" },
    { name: "Restaurante 9", categories: "Cafetería", photoUrl: "Pe4LE8EjMnyusT4uxTatcib2uAA.jpg", logoUrl: "O4vBnESSprdmfvUmtGrw5Jf7U.png" },
]

const CATEGORIES = [
    "Italiana", "Japonesa", "Carnes y Parrilla", "Internacional",
    "Cafetería", "Postres", "Chocolatería", "Vinos y Licores",
    "Comida Saludable", "Lounge y Bebidas", "Mexicana", "Peruana",
    "Fusión", "Helados", "China", "Pizzería",
    "Hamburguesas", "Panadería", "Deli market", "Gourmet",
]

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Restaurants(props) {
    return <Directory {...props} gridId="restaurantes-grid" square={true} searchLabel="Buscar restaurantes" chipsLabel="Tipos de comida" alt="Logo" />
}

Restaurants.defaultProps = {
    eyebrow: "Directorio",
    sub: "Tipo de comidas",
    placeholder: "Busca un restaurante o tipo de comida",
    categories: CATEGORIES,
    mainChips: 6,
    items: ITEMS,
    emptyText: EMPTY_TEXT,
}

addPropertyControls(Restaurants, directoryControls(Restaurants.defaultProps))
