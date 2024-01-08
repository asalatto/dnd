import "./Ability.css";
import Input from "../Input/Input";
import { titleize, calculateModifier, getModifierDisplay, getProficiencyBonus } from "../../utils";

export default function Ability({
    name="",
    value="",
    skills=[],
    proficiencies=[],
    saving_throws=[],
    level=1,
    updateCharacter,
    updateSkillProficiency,
    updateSavingThrow
}) {
    const modifier = calculateModifier(value);
    const modifierDisplay = getModifierDisplay(modifier);
    const savingThrow = saving_throws.includes(name) ? + (getProficiencyBonus(level) + modifier) : modifier;
    const savingThrowDisplay = getModifierDisplay(savingThrow);

    return (
        <div className="ability">
            <div className="ability-block">
                <Input name={name} label={titleize(name)} value={value} onChange={updateCharacter} />
                <div className="modifier" data-mod={modifierDisplay}>{modifierDisplay}</div>
                <label className="saving-throw">
                    <input 
                        type="checkbox"
                        value={name}
                        onChange={updateSavingThrow}
                        checked={saving_throws.includes(name)}
                    /> 
                    saving throw ({savingThrowDisplay})
                </label>
            </div>

            <ul className="skills">
                {skills.map(skill => {
                    const bonus = proficiencies.includes(skill) ? + (getProficiencyBonus(level) + modifier) : modifier;
                    const bonusDisplay = getModifierDisplay(bonus);

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
                                <span> ({bonusDisplay})</span>
                            </label>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}