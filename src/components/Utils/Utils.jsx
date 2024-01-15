import "./Utils.scss";
import { useState } from 'react';
import { titleize } from "../../utils";


export function Tooltip({children}) {
    return (
        <span className="util-tooltip">
            <span className="util-tooltip-icon">?</span>
            <span className="util-tooltip-message">{children}</span>
        </span>
    )
}

export function Input({name="", tooltip, ...props}) {
    return (
        <div className="util-text-input">
            <label htmlFor={name}>
                {titleize(name)}
                {tooltip ? <Tooltip>{tooltip}</Tooltip> : ''}
            </label>
            <input type="text" id={name} {...props}></input>
        </div>
    )
}

export function ExpandBox({limit=125, children, ...props}) {
    const [expanded, setExpanded] = useState(false);

    function truncate(string) {
        string = (string.length > limit) ? string.slice(0, limit - 1) + '...' : string;
        return string;
    };
    
    return (
        <div {...props}>
            { expanded ? children : truncate(children) }
            { children.length > limit ? <a onClick={() => setExpanded(!expanded)}>({expanded ? 'less' : 'more'})</a> : '' }
        </div>
    )
}