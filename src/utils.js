export function titleize(string) {
    const capitalized = string.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1))
    return capitalized.join(' ');
}

export function truncate(string, length) {
    const truncated = (string.length > length) ? string.slice(0, length-1): string;
    return truncated;
}

export function getLocalData(key, defaultData) {
    if (window.localStorage.getItem(key)) {
        return JSON.parse(window.localStorage.getItem(key))
    }
    return defaultData;
}

export async function getApiData(endpoint) {
    return fetch(`https://www.dnd5eapi.co/api/${endpoint}`).then((response) => response.json())
}

export function calculateModifier(number) {
    const modifier = isNaN(number) ? 0 : Math.floor((number - 10) / 2);
    return modifier;
}

export function getModifierDisplay(modifier) {
    const display = `${ Math.sign(modifier) === 1 ? `+` : `` }${ modifier }`;
    return display;
}

export function getProficiencyBonus(level) {
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

export function d(num = 20) {
    return Math.floor(Math.random() * num + 1);
}

export function roll(times, die) {
    let total = 0;
    for (let i = 0; i < times; i++) {
        total += d(die);
    }
    return total;
}

export function rollArray(times, die) {
    let array = [];
    for (let i = 0; i < times; i++) {
        array.push(d(die));
    }
    return array;
}