/* Interfaces */

export interface ApiResults {
    count: number;
    results: any[];
}


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

// Gets data from DnD 5e API endpoint
export async function getApiData(endpoint) {
    return fetch(`https://www.dnd5eapi.co/api/${endpoint}`).then((response) => response.json())
}

// Parses the DnD 5e API's response description based on request type 
export function getApiItemDescription(endpoint: string, data: any): string {
    let val = '';

    if (endpoint === 'spells') {
        val += `(Range: ${data.range}) ${data.desc} ${data.higher_level ?? ''}`;
    } else if (endpoint === 'equipment') {
        val += `[${data.equipment_category.name}] `;
        if (data.equipment_category.index === 'weapon') {
            val += `${data.category_range} weapon (${data.damage.damage_dice} ${data.damage.damage_type.name} damage). `;
            if (data.range) {
                val += `Range ${data.range.normal}${data.range.long ? `/${data.range.long}` : ''}. `;
            }
        } 
        if (data.contents?.length > 0) {
            val += `Contains: ${data.contents.map(item => ` ${item.item.name}${item.quantity > 1 ? ` (${item.quantity})` :''}`)}. `; 
        }
        val += data.desc ?? '';
    } else {
        val += data.desc;
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

// Roll a d# (ex d8, d20)
export function d(num: number = 20): number {
    return Math.floor(Math.random() * num + 1);
}

// Roll a dice an amount of times, #d# (ex 2d6, 5d10) and return total
export function roll(times: number, die: number): number {
    let total = 0;
    for (let i = 0; i < times; i++) {
        total += d(die);
    }
    return total;
}

// Roll a dice an amount of times, #d# (ex 2d6, 5d10) and return array of totals
export function rollArray(times: number, die: number): number[] {
    let array = [];
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
