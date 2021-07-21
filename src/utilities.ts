// ============ Utility Functions ============ //

export function deepFreeze<T>(object: T): Readonly<T> {
    for (const key in object) {
        if (!object[key] && Object.isFrozen(object[key])) continue;
        if (typeof object[key] !== 'object' && typeof object[key] !== 'function') continue;
        deepFreeze(object[key]);
    }
    return Object.freeze(object);
}

export function matchAll(pattern: RegExp, string: string): Array<string>[] {
    if (!pattern.global) pattern = new RegExp(pattern, 'g');

    const matches = [];
    let match;

    do {
        match = pattern.exec(string);
        if (match) matches.push(match);
    } while (match);

    return matches;
}