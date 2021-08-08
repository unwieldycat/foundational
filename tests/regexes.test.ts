// ================= Import ================= //

import { matchAll } from '../src/utilities';
import regexes from '../src/regexes';

// ============= Test Validators ============= //

describe('test validation regexes', () => {
    test('option alias validator', () => {
        expect(regexes.aliasValidate.test('-a')).toBe(true);
        expect(regexes.aliasValidate.test('-abc')).toBe(false);
        expect(regexes.aliasValidate.test('--abc')).toBe(false);
        expect(regexes.aliasValidate.test('-')).toBe(false);
    });

    test('option name validator', () => {
        expect(regexes.optionValidate.test('--abc')).toBe(true);
        expect(regexes.optionValidate.test('-abc')).toBe(false);
        expect(regexes.optionValidate.test('-a')).toBe(false);
        expect(regexes.optionValidate.test('--')).toBe(false);
    });
});

// ============== Test Parsing ============== //

describe('test parsing regexes', () => {
    test('option parsing', () => {
        const parse = (s: string): string[][] => matchAll(regexes.optionParse, s);

        expect(parse('-f pizza -f="pizza" --favorite-food pizza --favorite-food="pizza"'))
            .toStrictEqual([
                ['-f pizza', '-f', 'pizza'],
                ['-f="pizza"', '-f', '"pizza"'],
                ['--favorite-food pizza', '--favorite-food', 'pizza'],
                ['--favorite-food="pizza"', '--favorite-food', '"pizza"']
            ]);
        
        expect(parse('--- -- hi')).toStrictEqual([]);
    });

    test('the argument parser', () => {
        const parse = (s: string): string[][] => matchAll(regexes.argumentParse, s);

        expect(parse('<arg1> <arg2> [arg3...]'))
            .toStrictEqual([
                ['<arg1> <arg2> [arg3...]', '<arg1> <arg2> ', '[arg3...]']
            ]);

        expect(parse('<arg1> [arg2] <arg3>')).toStrictEqual([]);
        expect(parse('<<>> [...hi...]')).toStrictEqual([]);
    });
});