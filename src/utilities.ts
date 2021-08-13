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

export function maxLength(array: string[]): number {
    let maxLength = 0;

    array.forEach((s) => {
        if (s.length > maxLength) maxLength = s.length;
    });

    return maxLength;
}

export function padStringTo(string: string, length: number, left?: boolean): string {
    if (length <= string.length) return string;

    const whitespace = Array(length - string.length)
        .fill(' ')
        .join();
    const padded = left ? whitespace + string : string + whitespace;

    return padded;
}

export function removeFromArray(array: string[], searchPattern: RegExp): string[] {
    const newArray: string[] = [];

    for (const s of array) {
        // RegExp.test() is broken here for some reason
        if (s.match(searchPattern)) continue;
        newArray.push(s);
    }

    return newArray;
}
