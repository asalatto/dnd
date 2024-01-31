import './index.scss';


export default function NewCharForm({
    createFunction
}) {
    return (
        <form className="new-character-form centered" onSubmit={createFunction}>
            <label className="centered" htmlFor="character_name">Enter a new character name:</label>
            <input type="text" name="character_name" id="character_name" placeholder="Character name" />
            <input type="submit" value="Create" />
            <div className="error"></div>
        </form>
    )
}