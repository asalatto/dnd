import "./Input.scss";
import { titleize } from "../../utils";
import { Tooltip } from "../Utils/Utils";

export default function Input({name="", tooltip, ...props}) {
    return (
        <div className="text-input">
            <label htmlFor={name}>
                {titleize(name)}
                {tooltip ? <Tooltip>{tooltip}</Tooltip> : ''}
            </label>
            <input type="text" id={name} {...props}></input>
        </div>
    )
}