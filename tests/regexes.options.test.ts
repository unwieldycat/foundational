// ================================= Import ================================= //

import { matchAll } from '../src/utilities';
import regexes from '../src/regexes';

// =========================== Test Option Regexp =========================== //

test('option alias validator', () => {
    expect(regexes.aliasValidate.test('-a')).toBe(true);
    expect(regexes.aliasValidate.test('-ab')).toBe(true);
    expect(regexes.aliasValidate.test('-abc')).toBe(false);
    expect(regexes.aliasValidate.test('--abc')).toBe(false);
    expect(regexes.aliasValidate.test('-')).toBe(false);
});

test('option name validator', () => {
    expect(regexes.optionValidate.test('--abc')).toBe(true);
    expect(regexes.optionValidate.test('--abc-d')).toBe(true);
    expect(regexes.optionValidate.test('--abc.d')).toBe(true);
    expect(regexes.optionValidate.test('-abc')).toBe(false);
    expect(regexes.optionValidate.test('-a')).toBe(false);
    expect(regexes.optionValidate.test('--')).toBe(false);
});

test('option parsing', () => {
    const parse = (s: string): string[][] => matchAll(regexes.optionParse, s);

    expect(
        parse('-f pizza -f="pizza" --favorite-food pizza --favorite.food pizza --favorite-food="pizza"')
    ).toStrictEqual([
        ['-f pizza', '-f', 'pizza'],
        ['-f="pizza"', '-f', '"pizza"'],
        ['--favorite-food pizza', '--favorite-food', 'pizza'],
        ['--favorite.food pizza', '--favorite.food', 'pizza'],
        ['--favorite-food="pizza"', '--favorite-food', '"pizza"']
    ]);

    expect(parse('--- -- hi')).toStrictEqual([]);
});
