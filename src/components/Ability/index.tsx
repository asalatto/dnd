import "./index.scss";
import { Input, Tooltip } from "../Utils";
import {
    titleize, 
    calculateModifier, 
    getModifierDisplay, 
    getProficiencyBonus,
    getPassivePerception
} from "../../utils";


interface AbilityProps {
    character_name: string;
    name?: string;
    value?: number|string;
    skills?: any[];
    proficiencies?: any[];
    saving_throws?: any[];
    level?: number;
    updateCharacterFunction?: Function;
    updateListFunction?: Function;
}

export default function Ability({
    character_name,
    name="",
    value=0,
    skills=[],
    proficiencies=[],
    saving_throws=[],
    level=1,
    updateCharacterFunction,
    updateListFunction,
}: AbilityProps) {
    
    const modifier = calculateModifier(value as number);
    const modifier_display = value ? getModifierDisplay(modifier) : null;
    const saving_throw = saving_throws.includes(name) ? + (getProficiencyBonus(level) + modifier) : modifier;
    const saving_throw_display = value ? `(${getModifierDisplay(saving_throw)})` : null;

    return (
        <div className="ability">
            <div className="ability-block">
                <Input name={name} label={titleize(name)} value={value} onChange={(event) => updateCharacterFunction(character_name, event)} />
                <div className="modifier" data-mod={modifier_display ?? 0}>{modifier_display}</div>
                <label className="saving-throw">
                    <input 
                        type="checkbox"
                        value={name}
                        onChange={(event) => updateListFunction(character_name, event, 'saving_throws')}
                        checked={saving_throws.includes(name)}
                    /> 
                    saving throw {saving_throw_display}
                </label>
            </div>

            <ul className="skills">
                {skills.map(skill => {
                    const bonus = proficiencies.includes(skill) ? + (getProficiencyBonus(level) + modifier) : modifier;
                    const bonusDisplay = value ? `(${getModifierDisplay(bonus)})` : null;

                    return (
                        <li key={skill}>
                            <input 
                                type="checkbox"
                                id={skill}
                                value={skill}
                                onChange={(event) => updateListFunction(character_name, event, 'skill_proficiencies')}
                                checked={proficiencies.includes(skill)}
                            /> 
                            <label htmlFor={skill}>
                                { titleize(skill) }
                                <span> {bonusDisplay}</span>
                            </label>
                        </li>
                    )
                })}
            </ul>

            { (name === 'wisdom' && value) && 
                <small style={{ whiteSpace: 'nowrap' }}>
                    <Tooltip>10 + perception modifier</Tooltip><strong>Passive Perception: </strong>
                    {getPassivePerception(
                        value as number, 
                        proficiencies.includes('perception'),
                        level as number
                    )}
                </small>
            }
        </div>
    )
}