import "./Tooltip.css";


export default function Tooltip({children}) {
    return (
        <span className="tooltip">
            <span className="tooltip-icon">?</span>
            <span className="tooltip-message">{children}</span>
        </span>
    )
}