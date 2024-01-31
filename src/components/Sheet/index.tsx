import './index.scss';
import { Input } from '../Utils';
import Ability from '../Ability';
import ItemList from '../ItemList';
import Search from '../Search';
import { Character, skill_map } from '../../data';
import { 
    calculateModifier, 
    getModifierDisplay, 
    getProficiencyBonus, 
    addItemFromApi
} from '../../utils';


interface SheetProps {
    character: Character;
    clearFunction: Function;
    updateFunction: Function;
    updateCurrencyFunction: Function;
    updateCheckboxListFunction: Function;
    saveItemFunction: Function;
    editItemFunction: Function;
    rollRandomAbilities: Function;
}

export default function Sheet({
    character,
    clearFunction,
    updateFunction,
    updateCurrencyFunction,
    updateCheckboxListFunction,
    saveItemFunction,
    editItemFunction,
    rollRandomAbilities
}: SheetProps) {

    const proficiency_bonus = getProficiencyBonus(character.level);
    const spell_save_dc = (8 + calculateModifier(character[character.spellcasting_ability]) + proficiency_bonus);
    const spell_attack_bonus = (getModifierDisplay(calculateModifier(character[character.spellcasting_ability]) + proficiency_bonus));


    return (
        <div className="character-sheet" style={{ backgroundColor: character.theme }}>
            <article>
                <div className="flex space-between">
                    <div className="flex">
                        <h1 style={{display: 'inline-block'}}>Character{character.character_name && `: ${character.character_name}`}</h1>
                        <button className="heading-button" onClick={() => clearFunction(character.character_name)}>Clear</button>
                    </div>
                    <div>
                        <label htmlFor="theme">Theme: </label>
                        <input type="text" id="theme" onChange={(event) => updateFunction(character.character_name, event)} value={character.theme} />
                        <span className="form-hint" style={{textAlign: 'right'}}>Hint: enter <a href="https://www.w3.org/wiki/CSS/Properties/color/keywords" target="_blank" style={{ color: 'pink' }}><strong>valid CSS color value</strong></a>. Or "pink"</span>
                    </div>
                </div>
                <section className="sheet-section">
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="class" value={character.class} />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="race" value={character.race} />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="background" value={character.background} />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="level" type="number" value={character.level} />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="experience_points" type="number" value={character.experience_points} />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="alignment" value={character.alignment} />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="hit_dice" value={character.hit_dice} />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="hit_dice_total" value={character.hit_dice_total} />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="armor_class" value={character.armor_class} tooltip="Base is 10 + dexterity modifier" />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="hit_point_maximum" type="number" min={0} value={character.hit_point_maximum} />
                    <Input layout="small" onChange={(event) => updateFunction(character.character_name, event)} name="speed" value={character.speed} />
                </section>

                <div className="flex space-between">
                    <h2 className="section-heading">Abilities &amp; Skills <small>Modifiers appear when you enter ability scores. Check off proficiencies.</small></h2>
                    <a className="button--feature" onClick={() => rollRandomAbilities(character.character_name, Object.keys(skill_map))} style={{ alignSelf: 'flex-end' }}>
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
                                character_name={character.character_name}
                                key={skill} 
                                name={skill}
                                skills={skill_map[skill]}
                                proficiencies={proficiencies}
                                saving_throws={character.saving_throws}
                                level={character.level}
                                updateCharacterFunction={updateFunction} 
                                updateListFunction={updateCheckboxListFunction} 
                                value={character[skill]} 
                            />
                        })
                    }
                </section>

                <div className="flex section-heading">
                    <h2 style={{display: 'inline-block'}}>Equipment &amp; Inventory</h2>
                    <button className="heading-button" onClick={() => clearFunction(character.character_name, 'equipment')}>Clear</button>
                </div>
                <section className="sheet-section flex space-around">
                    <div>Currency:</div>
                    {character.currency.map(cur => {
                        return (
                            <label className="flex" key={cur.name} style={{ width: '16%' }}>
                                <img width="20" height="20" src={`${process.env.PUBLIC_URL}/images/${cur.name}.png`} alt={`${cur.name} piece`} />
                                <input 
                                    type="number" 
                                    name={cur.name} 
                                    min="0" 
                                    style={{ width: '65%', margin: '0 4px' }} 
                                    placeholder={cur.name} value={cur.amount} 
                                    onChange={(event) => updateCurrencyFunction(character.character_name, event)} 
                                /> {cur.label}
                            </label>
                        )
                    })}
                </section>
                <form className="new-item-form" onSubmit={(event) => saveItemFunction(character.character_name, event, 'equipment')}>
                    <label>Add Equipment: </label>
                    <select className="form-field" name="category">
                        <option value="" disabled>Equipment category</option>
                        <option value="inventory">Inventory</option>
                        <option value="magic">Magic</option>
                        <option value="equipment">Weapons &amp; Armor</option>
                    </select>
                    <Search name="item_name" endpoint={['equipment', 'magic-items']} updateFunction={addItemFromApi} placeholder="Equipment name" />
                    <input type="number" min="0" className="form-field" name="quantity" placeholder="Amt" style={{ width: '75px' }} />
                    <textarea className="form-field" name="description" rows={1} cols={40} placeholder="Details" style={{ margin: '4px 14px' }}></textarea>
                    <input type="submit" value="Save" />
                    <div className="error"></div>
                </form>
                <div className="item-list-container">
                    {
                        ['equipment', 'inventory', 'magic'].map(category => {
                            const equipment = character.equipment.filter(item => item.category == category);
                            if (equipment.length > 0) {
                                return <ItemList 
                                    character_name={character.character_name}
                                    key={category} 
                                    item_type="equipment"
                                    item_category={category} 
                                    items={equipment} 
                                    editItemFunction={editItemFunction} />
                            }
                        }) 
                    }
                </div>

                <div className="flex section-heading">
                    <h2 style={{display: 'inline-block'}}>Spells &amp; Cantrips</h2>
                    <button className="heading-button" onClick={() => clearFunction(character.character_name, 'spells')}>Clear</button>
                </div>
                <section className="sheet-section">
                    <div className="flex">
                        <div className="util-text-input">
                            <label htmlFor="spellcasting_ability">
                                Spellcasting Ability
                            </label>
                            <select id="spellcasting_ability" onChange={(event) => updateFunction(character.character_name, event)} value={character.spellcasting_ability}>
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
                    
                <form className="new-item-form" onSubmit={(event) => saveItemFunction(character.character_name, event, 'spells')}>
                    <label>Add Spell: </label>
                    <select className="form-field" name="level">
                        <option value="" disabled>Spell level</option>
                        {
                            Array.from(Array(10).keys()).map(lvl => {
                                return <option key={lvl} value={lvl}>{lvl == 0 ? `Cantrip` : lvl}</option>
                            })
                        }
                    </select>
                    <Search name="item_name" endpoint={['spells']} updateFunction={addItemFromApi} placeholder="Spell name" />
                    <textarea className="form-field" name="description" rows={1} cols={40} placeholder="Effects &amp; details"></textarea>
                    <input type="submit" value="Save" />
                    <div className="error"></div>
                </form>

                <div className="item-list-container">
                    {
                        Array.from(Array(10).keys()).map(lvl => {
                            const spells = character.spells.filter(spell => spell.level == lvl);
                            if (spells.length > 0) {
                                return <ItemList 
                                    character_name={character.character_name}
                                    key={lvl} 
                                    item_type="spells"
                                    item_category={lvl} 
                                    items={spells} 
                                    editItemFunction={editItemFunction} />
                            }
                        }) 
                    }
                </div>
            </article>
        </div>
    )

}