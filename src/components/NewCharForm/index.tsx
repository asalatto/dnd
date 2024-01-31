import './index.scss';
import { 
    getLocalData,
    setLocalData
} from '../../utils';


export default function NewCharForm({
    createFunction
}) {

    // Lets user import their previous legacy "character" local storage item
    const legacy_character = window.localStorage.getItem('character') ? JSON.parse(window.localStorage.getItem('character')) : null;
    const importCharacter = () => {
        const characters_list = getLocalData('characters', []);
        characters_list.push(legacy_character);
        setLocalData('characters', characters_list);

        window.location.reload();
    }

    return (
        <>
            <form className="new-character-form centered" onSubmit={createFunction}>
                <label className="centered" htmlFor="character_name">Enter a new character name:</label>
                <input type="text" name="character_name" id="character_name" placeholder="Character name" />
                <input type="submit" value="Create" />
                <div className="error"></div>
            </form>
            { legacy_character && 
                <p style={{ textAlign: 'center' }}>
                    <button onClick={importCharacter}>Use {legacy_character.character_name}</button>
                </p>
            }
        </>
    )
}