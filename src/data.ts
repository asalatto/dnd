interface Spell {
    name: string;
    level: number;
    description: string;
}

interface Equipment {
    name: string;
    description: string;
}

interface Currency {
    name: string;
    label: string;
    amount: number;
}

export interface Character {
    theme: string;
    character_name: string;
    class: string;
    race: string;
    background: string;
    level: number;
    experience_points: number|"";
    alignment: string;
    strength: number|"";
    dexterity: number|"";
    constitution: number|"";
    intelligence: number|"";
    wisdom: number|"";
    charisma: number|"";
    saving_throws: string[];
    skill_proficiencies: string[];
    armor_class: number|"";
    speed: string;
    hit_point_maximum: string|number;
    current_hit_points: string|number;
    hit_dice: string|number;
    hit_dice_total: string|number;
    spellcasting_ability: "charisma"|"intelligence"|"wisdom"|"";
    spells: Spell[];
    equipment: Equipment[];
    currency: Currency[];
}

export const blank_character: Character = {
    "theme": "",
    "character_name": "",
    "class": "",
    "race": "",
    "background": "",
    "level": 1,
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
    "spellcasting_ability": "",
    "spells": [],
    "equipment": [],
    "currency": [
        {"name": "copper", "label": "CP", "amount": 0},
        {"name": "silver", "label": "SP", "amount": 0},
        {"name": "electrum", "label": "EP", "amount": 0},
        {"name": "gold", "label": "GP", "amount": 0},
        {"name": "platinum", "label": "PP", "amount": 0},
    ]
}

export const skill_map = {
    "strength": ["athletics"],
    "dexterity": ["acrobatics", "sleight of hand", "stealth"],
    "constitution": [],
    "intelligence": ["arcana", "history", "investigation", "nature", "religion"],
    "wisdom": ["animal handling", "insight", "medicine", "perception", "survival"],
    "charisma": ["deception", "intimidation", "performance", "persuasion"],
}