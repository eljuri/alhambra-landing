import { addPropertyControls, ControlType } from "framer"
import { useAlhambraStyles, ROOT_CLASS } from "./Theme.tsx"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Probe(props) {
    useAlhambraStyles()
    return (
        <div className={ROOT_CLASS} style={{ padding: 40, background: "var(--ink)", color: "var(--cream)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 64 }}>{props.text}</h2>
            <p><i className="ph ph-arrow-right" /> Neutraface Text</p>
        </div>
    )
}
Probe.defaultProps = { text: "Vive lo extraordinario" }
addPropertyControls(Probe, { text: { type: ControlType.String, title: "Texto" } })
