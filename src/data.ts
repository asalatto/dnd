interface Spell {
    name:           string;
    level:          number;
    description:    string;
    editing:        boolean;
}

interface Equipment {
    name:           string;
    category:       "equipment"|"inventory"|"magic";
    quantity:       number;
    description:    string;
    editing:        boolean;
}

interface Feature {
    name:           string;
    description:    string;
    editing:        boolean;
}

interface Currency {
    name:   string;
    label:  string;
    amount: number|"";
}

export interface Character {
    theme:                  string;
    character_name:         string;
    class:                  string;
    race:                   string;
    background:             string;
    level:                  number;
    experience_points:      number|"";
    alignment:              string;
    strength:               number|"";
    dexterity:              number|"";
    constitution:           number|"";
    intelligence:           number|"";
    wisdom:                 number|"";
    charisma:               number|"";
    saving_throws:          string[];
    skill_proficiencies:    string[];
    armor_class:            number|"";
    speed:                  string;
    hit_point_maximum:      number|"";
    hit_point_current:      number|"";
    current_hit_points:     string|number;
    hit_dice:               string|number;
    hit_dice_total:         string|number;
    spellcasting_ability:   "charisma"|"intelligence"|"wisdom"|"";
    spells:                 Spell[];
    equipment:              Equipment[];
    features:               Feature[];
    currency:               Currency[];
}

export const blank_character: Character = {
    "theme":                "",
    "character_name":       "",
    "class":                "",
    "race":                 "",
    "background":           "",
    "level":                1,
    "experience_points":    "",
    "alignment":            "",
    "speed":                "",
    "armor_class":          "",
    "hit_point_maximum":    "",
    "hit_point_current":    "",
    "current_hit_points":   "",
    "hit_dice":             "",
    "hit_dice_total":       "",

    "saving_throws":        [],
    "skill_proficiencies":  [],
    "strength":             "",
    "dexterity":            "",
    "constitution":         "",
    "intelligence":         "",
    "wisdom":               "",
    "charisma":             "",

    "spellcasting_ability": "",
    "spells":               [],
    "equipment":            [],
    "features":             [],
    "currency": [
        {"name": "copper", "label": "CP", "amount": ""},
        {"name": "silver", "label": "SP", "amount": ""},
        {"name": "electrum", "label": "EP", "amount": ""},
        {"name": "gold", "label": "GP", "amount": ""},
        {"name": "platinum", "label": "PP", "amount": ""},
    ],
}

export const skill_map = {
    "strength":     ["athletics"],
    "dexterity":    ["acrobatics", "sleight of hand", "stealth"],
    "constitution": [],
    "intelligence": ["arcana", "history", "investigation", "nature", "religion"],
    "wisdom":       ["animal handling", "insight", "medicine", "perception", "survival"],
    "charisma":     ["deception", "intimidation", "performance", "persuasion"],
}