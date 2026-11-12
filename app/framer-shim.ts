// Imitación mínima del módulo "framer" para correr los componentes en Vite.
// En Framer se usa el módulo real; aquí los controles no hacen nada y los
// componentes leen sus defaultProps.

export const ControlType = {
    Boolean: "boolean",
    Number: "number",
    String: "string",
    Color: "color",
    Image: "image",
    ResponsiveImage: "responsiveimage",
    File: "file",
    Link: "link",
    Enum: "enum",
    Array: "array",
    Object: "object",
    ComponentInstance: "componentinstance",
    EventHandler: "eventhandler",
} as const

export function addPropertyControls(_component: unknown, _controls: unknown) {}

export const RenderTarget = {
    canvas: "CANVAS",
    export: "EXPORT",
    thumbnail: "THUMBNAIL",
    preview: "PREVIEW",
    current: () => "PREVIEW",
    hasRestrictions: () => false,
}
