import * as React from 'react'
import './App.css';
import { getLocalData, calculateModifier, getModifierDisplay, getProficiencyBonus, roll, rollArray } from './utils';
import Input from './components/Input/Input';
import AbilityArray from './components/AbilityArray/AbilityArray';
import SpellsList from './components/SpellsList/SpellsList';


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
    "spells": [],
}

const spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]


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

    function rollRandomAbilities() {
        const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
        abilities.forEach(ability => {
            const roll = rollArray(4,6);
            roll.sort();
            roll.shift();
            const total = roll.reduce((sum, add) => sum + add, 0);
            const obj = {};
            obj[ability] = total;

            setCharacter(character => ({
                ...character,
                ...obj
            }));
        })
    }

    function saveSpell(event) {
        event.preventDefault();
        
        const errorBox = event.target.querySelector('.error');
        const spellName = event.target.name.value.trim();
        if (!spellName) {
            errorBox.innerText = 'Enter spell name.';
            return;
        } else if (character.spells.findIndex(spell => spell.name == spellName) > -1) {
            errorBox.innerText = 'Spell already exists.';
            return;
        }
        errorBox.innerText = '';

        const newSpell = [{
            name: event.target.name.value,
            level: event.target.level.value,
            description: event.target.description.value
        }]

        setCharacter(character => ({
            ...character,
            ...{"spells": [...character.spells, ...newSpell]}
        }));

        event.target.reset();
    }

    function removeSpell(event) {
        const spellName = event.target.parentNode.getAttribute('data-spell-name');
        const spells = character.spells;
        const spellIndex = spells.findIndex(spell => spell.name == spellName);
        spells.splice(spellIndex, 1);

        setCharacter(character => ({
            ...character,
            ...{"spells": spells}
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
                        <span className="form-hint" style={{textAlign: 'right'}}>Hint: enter <a href="https://www.w3.org/wiki/CSS/Properties/color/keywords" target="_blank" style={{ color: 'pink' }}><strong>valid CSS color value</strong></a>. Or "pink"</span>
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

                <div className="flex space-between">
                    <h2>Abilities & Skills <small>Modifiers appear when you enter ability scores. Check off proficiencies.</small></h2>
                    <a className="button--feature" onClick={rollRandomAbilities}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-16 0 512 512"><path d="M106.75 215.06 1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43 82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72 81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97-108.63 190.1 208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z"/></svg>
                        Roll Random
                    </a>
                </div>
                <section className="sheet-section">
                    <AbilityArray 
                        character={character} 
                        updateCharacter={updateCharacter} 
                        updateSkillProficiency={updateSkillProficiency} 
                        updateSavingThrow={updateSavingThrow} 
                    />
                </section>

                <h2>Spells & Cantrips</h2>
                <section className="sheet-section">
                    <div className="flex">
                        <div className="text-input">
                            <label htmlFor="spellcasting_ability">
                                Spellcasting Ability
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

                <form className="new-spell-form" onSubmit={saveSpell}>
                        <label>Add New Spell: </label>
                        <select name="level">
                            <option value="" default disabled>Spell level</option>
                            <option value="0">Cantrip</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                        </select>
                        <input type="text" name="name" placeholder="Spell name" />
                        <textarea name="description" rows="1" cols="40" placeholder="Effects &amp; details" ></textarea>
                        <input type="submit" value="Save Spell" />
                        <div className="error"></div>
                    </form>

                <div className="spells-list-container">
                    { 
                        spellLevels.map(lvl => {
                            const spells = character.spells.filter(spell => spell.level == lvl);
                            return <SpellsList key={lvl} level={lvl} spells={spells} removeSpell={removeSpell} />
                        }) 
                    }
                </div>

            </article>
        </main>
    )

}