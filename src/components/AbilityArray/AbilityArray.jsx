import Ability from "../Ability/Ability";

const skill_map = {
    'strength': ['athletics'],
    'dexterity': ['acrobatics', 'sleight of hand', 'stealth'],
    'constitution': [],
    'intelligence': ['arcana', 'history', 'investigation', 'nature', 'religion'],
    'wisdom': ['animal handling', 'insight', 'medicine', 'perception', 'survival'],
    'charisma': ['deception', 'intimidation', 'performance', 'persuasion'],
}

export default function AbilityArray({character, updateCharacter, updateSkillProficiency, updateSavingThrow}) {
    return (
        <>
            {Object.keys(skill_map).map(skill => {
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
            })}
        </>
    )
}