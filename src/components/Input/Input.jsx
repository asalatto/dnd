import "./Input.css";
import { titleize } from "../../utils";

export default function Input({name="", ...props}) {
    return (
        <div className="text-input">
            <label htmlFor={name}>{ titleize(name) }</label>
            <input type="text" id={name} {...props}></input>
        </div>
    )
}