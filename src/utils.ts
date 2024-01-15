export function titleize(string: string): string {
    const capitalized = string.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1))
    return capitalized.join(' ');
}

export function getLocalData(key: string, defaultData: any): any {
    if (window.localStorage.getItem(key)) {
        return JSON.parse(window.localStorage.getItem(key))
    }
    return defaultData;
}

export async function getApiData(endpoint) {
    return fetch(`https://www.dnd5eapi.co/api/${endpoint}`).then((response) => response.json())
}
export interface ApiResults {
    count: number;
    results: any[];
}

export function calculateModifier(number: number): number {
    const modifier = isNaN(number) ? 0 : Math.floor((number - 10) / 2);
    return modifier;
}

export function getModifierDisplay(modifier: number): string {
    const display = `${ Math.sign(modifier) === 1 ? `+` : `` }${ modifier }`;
    return display;
}

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

export function d(num: number = 20): number {
    return Math.floor(Math.random() * num + 1);
}

export function roll(times: number, die: number): number {
    let total = 0;
    for (let i = 0; i < times; i++) {
        total += d(die);
    }
    return total;
}

export function rollArray(times: number, die: number): number[] {
    let array = [];
    for (let i = 0; i < times; i++) {
        array.push(d(die));
    }
    return array;
}