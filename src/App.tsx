import './App.scss';
import { useState, useEffect } from 'react';
import Modal from './components/Modal';
import NewCharForm from './components/NewCharForm';
import Sheet from './components/Sheet';
import { 
    getLocalData,
    setLocalData,
    getCurrentCharacterName,
    clearCharacter,
    updateCharacter,
    updateCharacterCurrency,
    updateCharacterCheckboxList,
    saveCharacterItem,
    editCharacterItem,
    rollForArray,
} from './utils';
import { Character, blank_character } from './data';


export default function App() {

    /* State/Render */
    const [allCharacters, setAllCharacters] = useState(() => getLocalData('characters', []));
    const [currentCharacterName, setCurrentCharacterName] = useState(() => getCurrentCharacterName());
    const [currentCharacter, setCurrentCharacter] = useState(() => {
        if (window.localStorage.getItem('characters')) {
            const characters = getLocalData('characters', []);
            const current_character = characters.find(char => char.character_name === currentCharacterName);
            return current_character ?? null;
        }
        return null;
    });

    useEffect(() => {
        if (window.localStorage.getItem('characters') != JSON.stringify(allCharacters)) {
            setLocalData('characters', allCharacters);
        }
        if (window.localStorage.getItem('current_character') && window.localStorage.getItem('characters')) {
            const current_character = allCharacters.find(char => char.character_name === currentCharacterName);
            setCurrentCharacter(current_character as Character);
        }
    }, [allCharacters, currentCharacterName]);


    /* Character Management Functions */
    const createNewCharacter = (event): void => {
        event.preventDefault();

        const value = event.target.elements.character_name.value;
        const errorBox = event.target.querySelector('.error');

        if (!value) {
            errorBox.textContent = 'Enter character name.';
            return;
        }    
        errorBox.textContent = '';
            
        const characters_data = JSON.parse(JSON.stringify(allCharacters));
        const new_character = blank_character;
        new_character.character_name = value;
        characters_data.push(new_character);

        setAllCharacters(characters_data);
        setCurrentCharacterName(new_character.character_name);
        setCurrentCharacter(new_character);
        setLocalData('characters', characters_data);
        setLocalData('current_character', new_character.character_name);
    }

    const deleteCharacter = (character_name: string): void => {
        const characters_data = JSON.parse(window.localStorage.getItem('characters'));
        const index = characters_data.findIndex(char => char.character_name === character_name);
        if (index > -1) {
            characters_data.splice(index, 1);
        }
        
        setLocalData('characters', characters_data);

        if (character_name === currentCharacterName) {
            setCurrentCharacterName(getCurrentCharacterName());
        }
    }

    // Clears character data, or key on character data, that's stored in state/local storage
    const clear = (character_name: string, category?: string): void => {
        const characters_copy = JSON.parse(JSON.stringify(allCharacters));
        const character_index = characters_copy.findIndex(char => char.character_name === character_name);
        if (character_index > -1) {
            const this_character = JSON.parse(JSON.stringify(characters_copy[character_index]));
            characters_copy[character_index] = clearCharacter(this_character, category);
            setAllCharacters(characters_copy);
        }
    }

    // Updates field in character state
    const update = (character_name: string, event: any): void => {
        const characters_copy = JSON.parse(JSON.stringify(allCharacters));
        const character_index = characters_copy.findIndex(char => char.character_name === character_name);
        if (character_index > -1) {
            const this_character = JSON.parse(JSON.stringify(characters_copy[character_index]));
            characters_copy[character_index] = updateCharacter(this_character, event);
            setAllCharacters(characters_copy);
        }
    }

    const updateCurrency = (character_name: string, event: any): void => {
        const characters_copy = JSON.parse(JSON.stringify(allCharacters));
        const character_index = characters_copy.findIndex(char => char.character_name === character_name);
        if (character_index > -1) {
            const this_character = JSON.parse(JSON.stringify(characters_copy[character_index]));
            characters_copy[character_index] = updateCharacterCurrency(this_character, event);
            setAllCharacters(characters_copy);
        }
    }

    // Updates checkbox-selected proficiencies in state
    const updateCheckboxList = (character_name: string, event: React.ChangeEvent, key: string): void => {
        const characters_copy = JSON.parse(JSON.stringify(allCharacters));
        const character_index = characters_copy.findIndex(char => char.character_name === character_name);
        if (character_index > -1) {
            const this_character = JSON.parse(JSON.stringify(characters_copy[character_index]));
            characters_copy[character_index] = updateCharacterCheckboxList(this_character, event, key);
            setAllCharacters(characters_copy);
        }
    }

    const rollRandomAbilities = (character_name: string, abilities: string[]): void => {
        const characters_copy = JSON.parse(JSON.stringify(allCharacters));
        const character_index = characters_copy.findIndex(char => char.character_name === character_name);
        if (character_index > -1) {
            const this_character = JSON.parse(JSON.stringify(characters_copy[character_index]));
            abilities.forEach(ability => {
                const roll = rollForArray(4,6);
                roll.sort();
                roll.shift();
                const total = roll.reduce((sum, add) => sum + add, 0);
                this_character[ability] = total;
            })
            characters_copy[character_index] = this_character;
            setAllCharacters(characters_copy);
        }
    }

    const saveItem = (character_name: string, event: any, key: string): void => {
        event.preventDefault();

        const characters_copy = JSON.parse(JSON.stringify(allCharacters));
        const character_index = characters_copy.findIndex(char => char.character_name === character_name);
        if (character_index > -1) {
            const this_character = JSON.parse(JSON.stringify(characters_copy[character_index]));
            const form = event.target;
            const fields = form.querySelectorAll('.form-field');
            const error_box = form.querySelector('.error') as HTMLElement;
            const item_name = form.item_name.value.trim();

            if (error_box) {
                if (!item_name) {
                    error_box.innerText = 'Enter name.';
                    return;
                } else if (this_character[key].findIndex(item => item.name == item_name) > -1) {
                    error_box.innerText = 'Item already exists.';
                    return;
                } else {
                    error_box.innerText = '';
                }
            }

            characters_copy[character_index] = saveCharacterItem(this_character, fields, key);
            setAllCharacters(characters_copy);
            form.reset();
        }
    }

    const editItem = (character_name: string, item_name: string, key: string, action: 'edit'|'remove', new_item?: object): void => {
        const characters_copy = JSON.parse(JSON.stringify(allCharacters));
        const character_index = characters_copy.findIndex(char => char.character_name === character_name);
        if (character_index > -1) {
            const this_character = JSON.parse(JSON.stringify(characters_copy[character_index]));
            characters_copy[character_index] = editCharacterItem(this_character, item_name, key, action, new_item);
            setAllCharacters(characters_copy);
        }
    }


    /* Character Switcher Component */
    const Switcher = () => {
        const [showMenu, setShowMenu] = useState(false);
        const [showModal, setShowModal] = useState(false);
        const characters = window.localStorage.getItem('characters') && JSON.parse(window.localStorage.getItem('characters'));

        return (<>
            <header className="main-header">
                <div className={`switcher ${showMenu && `showing`}`}>
                    Current Character: {currentCharacterName}
                    <a className="button" onClick={() => setShowMenu(!showMenu)}>{showMenu ? `Close` : `Switch` }</a>
                    <ul className="switcher-menu">
                        { 
                            characters.map(char => {
                                return (
                                    <li key={char.character_name}>
                                        <a className="button red" onClick={() => deleteCharacter(char.character_name)}>delete</a>
                                        <a onClick={() => setCurrentCharacterName(char.character_name)}>{char.character_name}</a>
                                    </li>
                                )
                            })
                        }
                        <li>
                            <a id="create-new-character-button" onClick={() => (setShowModal(true))}>Create New Character</a>
                        </li>
                    </ul>
                </div>
            </header>
            {
                showModal && 
                <Modal modalOpen={showModal} modalFunction={setShowModal}>
                    <NewCharForm createFunction={createNewCharacter} />
                </Modal>
            }
        </>)
    }


    /* Render */
    return (<>
        <main className="page-wrapper">
            {
                currentCharacterName ?
                    <>
                        <Switcher />
                        <Sheet 
                            character={currentCharacter} 
                            clearFunction={clear}
                            updateFunction={update}
                            updateCurrencyFunction={updateCurrency}
                            updateCheckboxListFunction={updateCheckboxList}
                            saveItemFunction={saveItem}
                            editItemFunction={editItem}
                            rollRandomAbilities={rollRandomAbilities}
                        />
                    </>
                :
                    <NewCharForm createFunction={createNewCharacter} />
            }
        </main>

        <footer className="main-footer">
            <p>
                Typeahead data provided by <a href="https://www.dnd5eapi.co/" target="_blank">DnD 5e API</a>.
            </p>
        </footer>
    </>)

}