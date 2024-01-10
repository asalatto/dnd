import * as React from 'react'
import './App.css';
import { getLocalData, calculateModifier, getModifierDisplay, getProficiencyBonus } from './utils';
import Input from './components/Input/Input';
import AbilityArray from './components/AbilityArray/AbilityArray';

const blank_character = {
    "theme": "",

    "character_name": "",
    "class": "",
    "race": "",
    "background": "",
    "level": "",
    "experience_points": "",
    "alignment": "",

    "strength": "",
    "dexterity": "",
    "constitution": "",
    "intelligence": "",
    "wisdom": "",
    "charisma": "",
    "saving_throws": [],
    "skill_proficiencies": [],

    "armor_class": "",
    "speed": "",
    "hit_point_maximum": "",
    "current_hit_points": "",
    "hit_dice": "",
    "hit_dice_total": "",

    "actions": [],

    "spellcasting_ability": "",
    "spells": [{
        "name": "",
        "level": "",
        "description": "",
    }],
}

export default function App() {

    // Clears character stored in state/local storage
    function clearCharacter() {
        setCharacter(blank_character);
    }

    // Updates field in character state
    function updateCharacter(event) {
        const updatedField = {};
        updatedField[event.target.id] = event.target.value;
        setCharacter(character => ({
            ...character,
            ...updatedField
        }));
    }

    // Updates selected skill proficiencies in state
    function updateSkillProficiency(event) {
        const skill = event.target.id;
        const currentProficiencies = character.skill_proficiencies;

        if (event.target.checked && !currentProficiencies.includes(skill)) {
            currentProficiencies.push(skill);
        } else if (!event.target.checked && currentProficiencies.includes(skill)) {
            currentProficiencies.splice(currentProficiencies.indexOf(skill), 1);
        }

        setCharacter(character => ({
            ...character,
            ...{"skill_proficiencies": currentProficiencies}
        }));
    }

    // Updates selected ability saving throws in state
    function updateSavingThrow(event) {
        const ability = event.target.value;
        const currentSavingThrows = character.saving_throws;

        if (event.target.checked && !currentSavingThrows.includes(ability)) {
            currentSavingThrows.push(ability);
        } else if (!event.target.checked && currentSavingThrows.includes(ability)) {
            currentSavingThrows.splice(currentSavingThrows.indexOf(ability), 1);
        }

        setCharacter(character => ({
            ...character,
            ...{"saving_throws": currentSavingThrows}
        }));
    }

    const [character, setCharacter] = React.useState(() => getLocalData('character', blank_character));
    const proficiencyBonus = getProficiencyBonus(character.level);
    const spellSaveDC = (8 + calculateModifier(character[character.spellcasting_ability]) + proficiencyBonus);
    const spellAttackBonus = (getModifierDisplay(calculateModifier(character[character.spellcasting_ability]) + proficiencyBonus));

    // Keep local storage up-to-date with state
    React.useEffect(() => {
        const stringified = JSON.stringify(character);
        window.localStorage.setItem('character', stringified);
    }, [character]);


    return (
        <main className="page-wrapper" style={{ backgroundColor: character.theme }}>
            <article className="page">

                <div className="flex space-between">
                    <div className="flex">
                        <h1 style={{display: 'inline-block'}}>Character{character.character_name ? `: ${character.character_name}` : ''}</h1>
                        <button className="clear-button" onClick={clearCharacter}>Clear</button>
                    </div>
                    <div>
                        <label htmlFor="theme">Theme: </label>
                        <input type="text" id="theme" onChange={updateCharacter} value={character.theme} />
                        <span className="form-hint" style={{textAlign: 'right'}}>Hint: enter <a href="https://www.w3.org/wiki/CSS/Properties/color/keywords" target="_blank">valid CSS color value</a>. Or "pink"</span>
                    </div>
                </div>
                <section className="sheet-section">
                    <Input name="character_name" onChange={updateCharacter} value={character.character_name} />
                    <Input name="class" onChange={updateCharacter} value={character.class} />
                    <Input name="race" onChange={updateCharacter} value={character.race} />
                    <Input name="background" onChange={updateCharacter} value={character.background} />
                    <Input name="level" onChange={updateCharacter} value={character.level} />
                    <Input name="experience_points" onChange={updateCharacter} value={character.experience_points} />
                    <Input name="alignment" onChange={updateCharacter} value={character.alignment} />
                    <Input name="speed" onChange={updateCharacter} value={character.speed} />
                </section>
                <br/>
                <section className="sheet-section">
                    <Input name="armor_class" onChange={updateCharacter} value={character.armor_class} />
                    <Input name="hit_point_maximum" onChange={updateCharacter} value={character.hit_point_maximum} />
                    <Input name="hit_dice" onChange={updateCharacter} value={character.hit_dice} />
                    <Input name="hit_dice_total" onChange={updateCharacter} value={character.hit_dice_total} />
                </section>

                <h2>Abilities & Skills <small>Modifiers appear when you enter ability scores. Check off proficiencies.</small></h2>
                <section className="sheet-section">
                    <AbilityArray 
                        character={character} 
                        updateCharacter={updateCharacter} 
                        updateSkillProficiency={updateSkillProficiency} 
                        updateSavingThrow={updateSavingThrow} 
                    />
                </section>

                {/* <h2>Attacks & Spellcasting</h2>
                <section className="sheet-section">
                    <div className="action">
                        <input type="text" placeholder="Attack or spell"/>
                        <input type="text" placeholder="Damage" />
                        <input type="text" placeholder="Attack bonus" />
                        <label className="round-label">
                            <input type="checkbox" />
                            bonus action
                        </label>
                    </div>
                </section> */}

                <h2>Spells & Cantrips</h2>
                <section className="sheet-section">
                    <div className="flex">
                        <div>
                            <label htmlFor="spellcasting_ability">
                                Spellcasting Ability:
                            </label>
                            <select id="spellcasting_ability" onChange={updateCharacter} value={character.spellcasting_ability}>
                                <option value="" default disabled>Select ability</option>
                                <option value="charisma">Charisma</option>
                                <option value="intelligence">Intelligence</option>
                                <option value="wisdom">Wisdom</option>
                            </select>
                        </div>
                        <Input name="spell_save_DC" value={spellSaveDC} tooltip="8 + spellcasting ability modifier + proficiency bonus" readOnly={true} />
                        <Input name="spell_attack_bonus" value={spellAttackBonus} tooltip="spellcasting ability modifier + proficiency bonus" readOnly={true} />
                    </div>
                </section>

            </article>
        </main>
    )

}