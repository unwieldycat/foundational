// ============ Utility Functions ============ //

export function deepFreeze<T>(object: T): Readonly<T> {
    for (const key in object) {
        if (!object[key] && Object.isFrozen(object[key])) continue;
        if (typeof object[key] !== 'object' && typeof object[key] !== 'function') continue;
        deepFreeze(object[key]);
    }
    return Object.freeze(object);
}

export function define<T>(target: T, key: string, value: unknown): void {
    if (key === '__proto__') return;
    Object.defineProperty(target, key, {
        value: value,
        enumerable: true,
        writable: true,
        configurable: true
    });
}

export function matchAll(pattern: RegExp, string: string): Array<string[]> {
    if (!pattern.global) pattern = new RegExp(pattern, ['g', pattern.flags].join(''));
    if (string.length <= 0) return [];

    const matches: Array<string[]> = [];
    let match;

    do {
        match = pattern.exec(string);
        if (match) matches.push([...match]);
    } while (match);

    return matches;
}

export function longestString(array: string[]): string {
    let maxLength = 0;
    let index = 0;

    array.forEach((s, i) => {
        if (s.length > maxLength) {
            index = i;
            maxLength = s.length;
        }
    });

    return array[index];
}

export function padTo(length: number, string: string, left?: boolean): string {
    const whitespace = Array(length - string.length).join(' ');
    const padded = (left) ? whitespace + string : string + whitespace;

    return padded;
}
