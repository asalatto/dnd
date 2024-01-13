import * as React from 'react'
import './SpellsList.css';
import ExpandBox from '../ExpandBox/ExpandBox';
import { truncate } from '../../utils';

export default function SpellsList({level="", spells=[], removeSpell}) {
    const title = level == 0 ? 'Cantrips' : `Level ${level} Spells`;

    if (spells.length == 0) {
        return '';
    } else {
        return (
            <div className="spells-list">
                <h4>{title}</h4>
                <ul>
                    {
                        spells.map(spell => {                            
                            return (
                                <li key={spell.name} className="sheet-section" data-spell-name={spell.name}>
                                    <strong>{spell.name} </strong> 
                                    {/* <a className="button">edit</a> */}
                                    <a className="button red" onClick={removeSpell}>remove</a>
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