import "./index.scss";
import { ChangeEvent } from "react";
import { Input, Tooltip } from "../Utils";
import {
    titleize, 
    calculateModifier, 
    getModifierDisplay, 
    getProficiencyBonus,
    getPassivePerception
} from "../../utils";


interface AbilityProps {
    name?: string;
    value?: number|string;
    skills?: any[];
    proficiencies?: any[];
    saving_throws?: any[];
    level?: number;
    updateCharacter?: (event: any) => void;
    updateList?: (event: ChangeEvent, key: string) => void;
}

export default function Ability({
    name="",
    value=0,
    skills=[],
    proficiencies=[],
    saving_throws=[],
    level=1,
    updateCharacter,
    updateList,
}: AbilityProps) {
    
    const modifier = calculateModifier(value as number);
    const modifier_display = value ? getModifierDisplay(modifier) : null;
    const saving_throw = saving_throws.includes(name) ? + (getProficiencyBonus(level) + modifier) : modifier;
    const saving_throw_display = value ? `(${getModifierDisplay(saving_throw)})` : null;

    return (
        <div className="ability">
            <div className="ability-block">
                <Input name={name} label={titleize(name)} value={value} onChange={updateCharacter} />
                <div className="modifier" data-mod={modifier_display ?? 0}>{modifier_display}</div>
                <label className="saving-throw">
                    <input 
                        type="checkbox"
                        value={name}
                        onChange={(event) => updateList(event, 'saving_throws')}
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
                                onChange={(event) => updateList(event, 'skill_proficiencies')}
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