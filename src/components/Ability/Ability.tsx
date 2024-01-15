import "./Ability.scss";
import { ChangeEvent } from "react";
import { Input } from "../Utils/Utils";
import {
    titleize, 
    calculateModifier, 
    getModifierDisplay, 
    getProficiencyBonus
} from "../../utils";


export interface AbilityProps {
    name?: string;
    value?: number|string;
    skills?: any[];
    proficiencies?: any[];
    saving_throws?: any[];
    level?: number;
    updateCharacter?: (event: any) => void;
    updateSkillProficiency?: (event: any) => void;
    updateSavingThrow?: (event: ChangeEvent) => void;
}

export default function Ability({
    name="",
    value=0,
    skills=[],
    proficiencies=[],
    saving_throws=[],
    level=1,
    updateCharacter,
    updateSkillProficiency,
    updateSavingThrow
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
                        onChange={updateSavingThrow}
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
                                onChange={updateSkillProficiency}
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
        </div>
    )
}