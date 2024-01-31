import { Character, blank_character } from "./data";


/* Functions */

// Returns a string in title-case
export function titleize(string: string): string {
    const capitalized = string.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1))
    return capitalized.join(' ');
}

// Returns browser's local storage by key, or default value passed
export function getLocalData(key: string, defaultData: any): any {
    if (window.localStorage.getItem(key)) {
        return JSON.parse(window.localStorage.getItem(key))
    }
    return defaultData;
}

// Sets browser's local storage by key
export function setLocalData(key: string, localData: any): void {
    if (typeof localData === 'string') {
        window.localStorage.setItem(key, localData);
    } else {
        window.localStorage.setItem(key, JSON.stringify(localData));
    }
}

// Get current character's name from browser's local storage
export function getCurrentCharacterName() {
    const characters = window.localStorage.getItem('characters') ? JSON.parse(window.localStorage.getItem('characters')) : [];
    const current = window.localStorage.getItem('current_character');
    const character_exists = characters.findIndex(char => char.character_name === current) > -1;
    
    if (current && character_exists) {
        return current;
    } else if (characters.length > 0) {
        return characters[0].character_name;
    } else {
        return '';
    }
}

// Gets data from DnD 5e API endpoint
export async function getApiData(endpoint: string) {
    return fetch(`https://www.dnd5eapi.co/api/${endpoint}`).then((response) => response.json())
}

// Parses the DnD 5e API's response description based on request type 
export function getApiItemDescription(endpoint: string, data: any): string {
    let val = '';
    const description = data.desc.join(" — ");

    if (endpoint === 'spells') {
        val += `(Range: ${data.range}) ${description} ${data.higher_level ?? ''}`;
    } else if (endpoint.includes('equipment')) {
        if (data.equipment_category.index === 'weapon') {
            val += `${data.category_range} weapon `;
            val += `(${data.damage.damage_dice} ${data.damage.damage_type.name} damage). `;
            if (data.range) {
                val += `Range ${data.range.normal}${data.range.long ? `/${data.range.long}` : ''}. `;
            }
        } 

        if (data.contents?.length > 0) {
            const quantity = data.contents.map(item => {
                return ` ${item.item.name}${item.quantity > 1 && ` (${item.quantity})`}`
            });
            val += `Contains: ${quantity}. `; 
        }

        val += description ?? '';
    } else {
        val += description;
    }

    return val;
 }

// Calculate ability modifier based on passed skill number (ex. -1, 2)
export function calculateModifier(number: number): number {
    const modifier = isNaN(number) ? 0 : Math.floor((number - 10) / 2);
    return modifier;
}

// Get UI display for an ability modifier (ex. +2, -1)
export function getModifierDisplay(modifier: number): string {
    const display = `${ Math.sign(modifier) === 1 ? `+` : `` }${ modifier }`;
    return display;
}

// Get proficiency bonus based on passed level
export function getProficiencyBonus(level: number) {
    let bonus = 2;

    if (level >= 5 && level < 9) {
        bonus = 3;
    } else if (level >= 9 && level < 13) {
        bonus = 4;
    } else if (level >= 13 && level < 17) {
        bonus = 5;
    } else if (level >= 17) {
        bonus = 6;
    }

    return bonus;
}

// Roll a d# (ex d8, d20) and return result
export function d(num: number = 20): number {
    return Math.floor(Math.random() * num + 1);
}

// Roll a die an amount of times, #d# (ex 2d6, 5d10), and return total
export function rollForTotal(times: number, die: number): number {
    let total = 0;
    for (let i = 0; i < times; i++) {
        total += d(die);
    }
    return total;
}

// Roll a die an amount of times, #d# (ex 2d6, 5d10), and return an array of each result
export function rollForArray(times: number, die: number): number[] {
    const array = [];
    for (let i = 0; i < times; i++) {
        array.push(d(die));
    }
    return array;
}

// Calculates passive perception based on wisdom ability and perception proficiency
export function getPassivePerception(wisdom: number, proficiency: boolean, level?: number) {
    const wisdom_modifier = calculateModifier(wisdom);
    const perception_modifier = proficiency ? (getProficiencyBonus(level) + wisdom_modifier) : wisdom_modifier;
    return 10 + perception_modifier;
}

// Used by the Search component to fill in details of a selected item from the DnD 5e API
export async function addItemFromApi(event: any, url: string): Promise<any> {
    if (!url) {
        return;
    }

    const form = event.target.closest('form');
    const fields = form.querySelectorAll('.form-field');
    const endpoint = event.target.closest('.search-input').getAttribute('data-endpoint');
    const data = await getApiData(url);

    fields.forEach(field => {
        if (field.name === 'item_name') {
            return;
        }

        let val;
        if (field.name === 'quantity' && !data[field.name]) {
            val = 1;
        } else if (field.name === 'category') {
            const category = data.equipment_category.index;
            const equipment_categories = ['armor', 'heavy-armor', 'light-armor', 'martial-melee-weapons', 'martial-ranged-weapons', 'martial-weapons', 'medium-armor', 'melee-weapons', 'ranged-weapons', 'shields', 'simple-melee-weapons', 'simple-ranged-weapons', 'simple-weapons', 'weapon'];
            const magic_categories = ['ring', 'rod', 'staff', 'wand', 'wondrous-items'];

            if (equipment_categories.includes(category)) {
                val = 'equipment';
            } else if (magic_categories.includes(category)) {
                val = 'magic';
            } else {
                val = 'inventory';
            }
        } else if (field.name === 'description') {
            val = getApiItemDescription(endpoint, data);
        } else {
            val = data[field.name];
        }

        form.querySelector(`[name="${field.name}"]`).value = val;
    })
}


/* Character Management Functions */

// Clears character details or field on character
export function clearCharacter(character: Character, category?: string): Character {
    if (category) {
        character[category] = [];
        return character;
    } else {
        const reset_character = blank_character;

        reset_character.character_name = character.character_name;
        return reset_character;
    }
}

// Updates field on character
export function updateCharacter(character: Character, event: any): Character {
    const field = event.target.id;
    const value = event.target.value || event.target.innerText.trim();
    character[field] = value;
    return character;
}

// Updates currency array on character
export function updateCharacterCurrency(character: Character, event: any): Character {
    const this_currency = character.currency.find(cur => cur.name === event.target.name);
    this_currency['amount'] = event.target.value; 
    return character;
}

// Updates checkbox-selected proficiencies on character
export function updateCharacterCheckboxList(character: Character, event: React.ChangeEvent, key: string): Character {
    const current_list = character[key];
    const element = event.target as HTMLInputElement;
    const value = element.value;

    if (element.checked && !current_list.includes(value)) {
        current_list.push(value);
    } else if (!element.checked && current_list.includes(value)) {
        current_list.splice(current_list.indexOf(value), 1);
    }

    return character;
}

// Saves new item (spell or equipment) to character
export function saveCharacterItem(character: Character, fields: any, key: string): Character {
    const new_item = {
        'editing': false
    };

    fields.forEach(field => {
        if (field.name === 'item_name') {
            new_item['name'] = field.value;
        } else {
            new_item[field.name] = field.value;
        }
    })

    character[key] = [...character[key], ...[new_item]];
    return character;
}

// Edits item (spell or equipment) on character
export function editCharacterItem(character: Character, item_name: string, key: string, action: 'edit'|'remove', new_item?: object): Character {
    const list = character[key];
    const item_index = list.findIndex(item => item.name === item_name);

    if (action === 'remove') {
        list.splice(item_index, 1);
        character[key] = list;
    } else {
        for (const [field, value] of Object.entries(new_item)) {
            list[item_index][field] = value;
        }
    }

    return character;
}