import './SpellsList.css';
import { useState, useEffect } from 'react';
import ExpandBox from '../ExpandBox/ExpandBox';


export default function SpellsList({level="", spells=[], removeSpell}) {
    function getSpells() {
        if (spells.length == 0) {
            return [];
        } else {
            return spells.map(spell => {
                spell['editing'] = spell['editing'] || false;
                return spell;
            });
        }
    }

    const [spellboxes, setSpellboxes] = useState(() => getSpells());

    useEffect(() => {
        setSpellboxes(getSpells());
    }, [spells])


    if (spellboxes.length == 0) {
        return '';
    } else {
        const title = level == 0 ? 'Cantrips' : `Level ${level} Spells`;

        function switchMode(spell_name) {
            const updated_spellboxes = spellboxes.map(spell => {
                if (spell.name == spell_name) {
                    spell['editing'] = !spell['editing'];
                }
                return spell;
            });
            setSpellboxes(updated_spellboxes);
        }

        return (
            <div className="spells-list">
                <h4>{title}</h4>
                <ul>
                    {
                        spellboxes.map(spell => {
                            return (
                                <li key={spell.name} className="sheet-section" data-spell-name={spell.name}>
                                    <div className="flex space-between">
                                        <span>
                                            <strong>{spell.name}</strong>
                                        </span>
                                        <span>
                                            <a className="button" onClick={() => switchMode(spell.name)}>edit</a>
                                            <a className="button red" onClick={() => removeSpell(spell.name)}>remove</a>
                                        </span>
                                    </div>
                                    <ExpandBox style={{fontSize: '90%'}}>{spell.description}</ExpandBox>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}