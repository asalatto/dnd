import './App.scss';
import * as React from 'react'
import Ability from './components/Ability/Ability';
import Search from './components/Search/Search';
import SpellsList from './components/SpellsList/SpellsList';
import { Input, ExpandBox } from './components/Utils/Utils';
import {
    Character,
    blank_character,
    skill_map
} from './data';
import { 
    getLocalData, 
    getApiData, 
    calculateModifier, 
    getModifierDisplay, 
    getProficiencyBonus, 
    rollArray,
    getApiItemDescription
} from './utils';


export default function App() {

    const [character, setCharacter] = React.useState(() => getLocalData('character', blank_character) as Character);
    const proficiency_bonus = getProficiencyBonus(character.level);
    const spell_save_dc = (8 + calculateModifier(character[character.spellcasting_ability]) + proficiency_bonus);
    const spell_attack_bonus = (getModifierDisplay(calculateModifier(character[character.spellcasting_ability]) + proficiency_bonus));

    // Keep local storage up-to-date with state
    React.useEffect(() => {
        const stringified = JSON.stringify(character);
        window.localStorage.setItem('character', stringified);
    }, [character]);

    // Clears character stored in state/local storage
    const clearCharacter = (): void => {
        setCharacter(blank_character as Character);
    }

    // Updates field in character state
    const updateCharacter = (event: any): void => {
        const updated_field = {};
        const val = event.target.value || event.target.innerText.trim();
        updated_field[event.target.id] = val;

        setCharacter(character => ({
            ...character,
            ...updated_field
        }) as Character);
    }

    const updateCurrency = (event: any): void => {
        const copied_currency = character.currency;
        const this_currency = copied_currency.find(cur => cur.name === event.target.name);
        this_currency['amount'] = event.target.value; 

        setCharacter(character => ({
            ...character,
            ...{"currency": copied_currency}
        }) as Character);
    }

    // Updates selected skill proficiencies in state
    const updateSkillProficiency = (event: React.ChangeEvent): void => {
        const element = event.target as HTMLInputElement;
        const skill = element.id;
        const current_proficiencies = character.skill_proficiencies;

        if (element.checked && !current_proficiencies.includes(skill)) {
            current_proficiencies.push(skill);
        } else if (!element.checked && current_proficiencies.includes(skill)) {
            current_proficiencies.splice(current_proficiencies.indexOf(skill), 1);
        }

        setCharacter(character => ({
            ...character,
            ...{"skill_proficiencies": current_proficiencies}
        }) as Character);
    }

    // Updates selected ability saving throws in state
    const updateSavingThrow = (event: React.ChangeEvent): void => {
        const element = event.target as HTMLInputElement;
        const ability = element.value;
        const current_saving_throws = character.saving_throws;

        if (element.checked && !current_saving_throws.includes(ability)) {
            current_saving_throws.push(ability);
        } else if (!element.checked && current_saving_throws.includes(ability)) {
            current_saving_throws.splice(current_saving_throws.indexOf(ability), 1);
        }

        setCharacter(character => ({
            ...character,
            ...{"saving_throws": current_saving_throws}
        }) as Character);
    }

    const rollRandomAbilities = (): void => {
        const abilities = Object.keys(skill_map);
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
            }) as Character);
        })
    }

    const saveItem = (event: any, key: string): void => {
        event.preventDefault();
        
        const form = event.target;
        const fields = form.querySelectorAll('.form-field');
        const error_box = form.querySelector('.error') as HTMLElement;
        const item_name = form.item_name.value.trim();

        if (error_box) {
            if (!item_name) {
                error_box.innerText = 'Enter name.';
                return;
            } else if (character[key].findIndex(item => item.name == item_name) > -1) {
                error_box.innerText = 'Item already exists.';
                return;
            } else {
                error_box.innerText = '';
            }
        }

        const new_item = {};
        fields.forEach(field => {
            if (field.name === 'item_name') {
                new_item['name'] = field.value;
            } else {
                new_item[field.name] = field.value;
            }
        })

        const character_copy = JSON.parse(JSON.stringify(character));
        character_copy[key] = [...character[key], ...[new_item]];

        setCharacter(character_copy as Character);

        form.reset();
    }
    
    const removeItem = (item_name: string, key: string): void => {
        const items = character[key];
        const item_index = items.findIndex(item => item.name == item_name);
        items.splice(item_index, 1);

        const character_copy = JSON.parse(JSON.stringify(character));
        character_copy[key] = items;

        setCharacter(character_copy as Character);
    }

    const addItemFromApi = async (event: any): Promise<any> => {
        const data_index = event.target.getAttribute('data-index');
        if (!data_index) {
            return;
        }

        const form = event.target.closest('form');
        const fields = form.querySelectorAll('.form-field');
        const endpoint = event.target.closest('.search-input').getAttribute('data-endpoint');
        const data = await getApiData(`${endpoint}/${data_index}`);

        fields.forEach(field => {
            if (field.name === 'item_name') {
                return;
            }

            let val = data[field.name];
            if (field.name === 'description') {
                val = getApiItemDescription(endpoint, data);
            }

            form.querySelector(`[name="${field.name}"]`).value = val;
        })
        
    }


    return (<>
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
                    <Input layout="small" onChange={updateCharacter} name="character_name" value={character.character_name} />
                    <Input layout="small" onChange={updateCharacter} name="class" value={character.class} />
                    <Input layout="small" onChange={updateCharacter} name="race" value={character.race} />
                    <Input layout="small" onChange={updateCharacter} name="background" value={character.background} />
                    <Input layout="small" onChange={updateCharacter} name="level" type="number" value={character.level} />
                    <Input layout="small" onChange={updateCharacter} name="experience_points" type="number" value={character.experience_points} />
                    <Input layout="small" onChange={updateCharacter} name="alignment" value={character.alignment} />
                    <Input layout="small" onChange={updateCharacter} name="hit_dice" value={character.hit_dice} />
                    <Input layout="small" onChange={updateCharacter} name="hit_dice_total" value={character.hit_dice_total} />
                </section>
                <br/>
                <section className="sheet-section">
                    <Input onChange={updateCharacter} name="armor_class" value={character.armor_class} tooltip="Base is 10 + dexterity modifier" />
                    <Input onChange={updateCharacter} name="hit_point_current" type="number" value={character.hit_point_current} />
                    <Input onChange={updateCharacter} name="hit_point_maximum" type="number" min={0} value={character.hit_point_maximum} />
                    <Input onChange={updateCharacter} name="speed" value={character.speed} />
                </section>

                <div className="flex space-between">
                    <h2>Abilities & Skills <small>Modifiers appear when you enter ability scores. Check off proficiencies.</small></h2>
                    <a className="button--feature" onClick={rollRandomAbilities}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-16 0 512 512"><path d="M106.75 215.06 1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43 82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72 81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97-108.63 190.1 208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z"/></svg>
                        Roll Random
                    </a>
                </div>
                <section className="sheet-section">
                    {
                        Object.keys(skill_map).map(skill => {
                            const proficiencies = [];
                            if (character.skill_proficiencies.length > 0 && skill_map[skill].length > 0) {
                                skill_map[skill].forEach(skill => {
                                    if (character.skill_proficiencies.includes(skill)) {
                                        proficiencies.push(skill);
                                    }
                                })
                            }

                            return <Ability
                                key={skill} 
                                name={skill}
                                skills={skill_map[skill]}
                                proficiencies={proficiencies}
                                saving_throws={character.saving_throws}
                                level={character.level}
                                updateCharacter={updateCharacter} 
                                updateSkillProficiency={updateSkillProficiency} 
                                updateSavingThrow={updateSavingThrow}
                                value={character[skill]} 
                            />
                        })
                    }
                </section>

                <h2>Equipment</h2>
                <section className="sheet-section flex space-around">
                    <div>Currency:</div>
                    {character.currency.map(cur => {
                        return (
                            <label key={cur.name} style={{ width: '16%' }}>
                                <input type="number" name={cur.name} min="0" style={{ width: '75%' }} placeholder={cur.name} value={cur.amount} onChange={updateCurrency}/> {cur.label}
                            </label>
                        )
                    })}
                </section>                
                <form className="new-item-form" onSubmit={(event) => saveItem(event, 'equipment')}>
                    <label>Add New Equipment: </label>
                    <Search name="item_name" endpoint="equipment" updateFunction={addItemFromApi} placeholder="Equipment name" />
                    <textarea className="form-field" name="description" rows={1} cols={40} placeholder="Details" ></textarea>
                    <input type="submit" value="Save Equipment" />
                    <div className="error"></div>
                </form>
                <ul className="equipment-list-container sheet-section">
                    {
                        character.equipment.map(item => {
                            return (
                                <li key={item.name}>
                                    <a className="button red" style={{ float: 'right', marginTop: '0' }} onClick={() => removeItem(item.name, 'equipment')}>remove</a>
                                    <strong>{item.name}{item.description? ': ' : ''}</strong>
                                    <ExpandBox>{item.description}</ExpandBox>
                                </li>
                            )
                        }) 
                    }
                </ul>

                <h2>Spells & Cantrips</h2>
                <section className="sheet-section">
                    <div className="flex">
                        <div className="util-text-input">
                            <label htmlFor="spellcasting_ability">
                                Spellcasting Ability
                            </label>
                            <select id="spellcasting_ability" onChange={updateCharacter} value={character.spellcasting_ability}>
                                <option value="" disabled>Select ability</option>
                                <option value="charisma">Charisma</option>
                                <option value="intelligence">Intelligence</option>
                                <option value="wisdom">Wisdom</option>
                            </select>
                        </div>
                        <Input name="spell_save_DC" value={spell_save_dc} tooltip={`8 + ${character.spellcasting_ability || `spellcasting ability`} modifier + proficiency bonus`} readOnly={true} />
                        <Input name="spell_attack_bonus" value={spell_attack_bonus} tooltip={`${character.spellcasting_ability || `spellcasting ability`} modifier + proficiency bonus`} readOnly={true} />
                    </div>
                </section>
                    
                <form className="new-item-form" onSubmit={(event) => saveItem(event, 'spells')}>
                    <label>Add New Spell: </label>
                    <select className="form-field" name="level">
                        <option value="" disabled>Spell level</option>
                        {
                            Array.from(Array(10).keys()).map(lvl => {
                                return <option key={lvl} value={lvl}>{lvl == 0 ? `Cantrip` : lvl}</option>
                            })
                        }
                    </select>
                    <Search name="item_name" endpoint="spells" updateFunction={addItemFromApi} placeholder="Spell name" />
                    <textarea className="form-field" name="description" rows={1} cols={40} placeholder="Effects &amp; details"></textarea>
                    <input type="submit" value="Save Spell" />
                    <div className="error"></div>
                </form>

                <div className="spells-list-container">
                    {
                        Array.from(Array(10).keys()).map(lvl => {
                            const spells = character.spells.filter(spell => spell.level == lvl);
                            return <SpellsList key={lvl} level={lvl} spells={spells} removeItem={(event) => removeItem(event, 'spells')} />
                        }) 
                    }
                </div>

            </article>
        </main>

        <footer className="main-footer" style={{ backgroundColor: character.theme }}>
            <p>
                Typeahead data provided by <a href="https://www.dnd5eapi.co/" target="_blank" style={{ color: 'pink' }}>DnD 5e API</a>.
            </p>
        </footer>
    </>)

}