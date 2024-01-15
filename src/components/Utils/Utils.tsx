import "./Utils.scss";
import { useState } from "react";
import { titleize } from "../../utils";


interface TooltipProps {
    children: React.ReactNode;
}
export function Tooltip({
    children
}: TooltipProps) {
    return (
        <span className="util-tooltip">
            <span className="util-tooltip-icon">?</span>
            <span className="util-tooltip-message">{children}</span>
        </span>
    )
}

interface InputProps {
    name?: string;
    tooltip?: string;
    id?: string;
    value?: string|number;
    label?: string;
    onChange?: (event: any) => void;
    readOnly?: boolean;
}
export function Input({
    name="",
    tooltip,
    ...props
}: InputProps) {
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

interface ExpandBoxProps {
    limit?: number|string;
    children: string;
    style?: object;
}
export function ExpandBox({
    limit=125,
    children,
    ...props
}: ExpandBoxProps) {
    const [expanded, setExpanded] = useState(false);

    function truncate(string) {
        string = (string.length > limit) ? string.slice(0, (limit as number) - 1) + '...' : string;
        return string;
    };
    
    return (
        <div {...props}>
            { expanded ? children : truncate(children) }
            { children.length > (limit as number) ? <a onClick={() => setExpanded(!expanded)}>({expanded ? 'less' : 'more'})</a> : '' }
        </div>
    )
}