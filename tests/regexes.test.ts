// ================= Import ================= //

import { matchAll } from '../src/utilities';
import regexes from '../src/regexes';

// ============= Test Validators ============= //

describe('test validation regexes', () => {
    it('should validate proper option aliases', () => {
        expect(regexes.aliasValidate.test('-a')).toBe(true);
        expect(regexes.aliasValidate.test('-abc')).toBe(false);
        expect(regexes.aliasValidate.test('--abc')).toBe(false);
        expect(regexes.aliasValidate.test('-')).toBe(false);
    });

    it('should validate proper option names', () => {
        expect(regexes.optionValidate.test('--abc')).toBe(true);
        expect(regexes.optionValidate.test('-abc')).toBe(false);
        expect(regexes.optionValidate.test('-a')).toBe(false);
        expect(regexes.optionValidate.test('--')).toBe(false);
    });
});

// ============== Test Parsing ============== //

describe('test parsing regexes', () => {
    it('should parse valid options', () => {
        const parse = (s: string): string[][] => matchAll(regexes.optionParse, s);

        // im sorry if you're this basic
        expect(parse('-f pizza -f="pizza" --favorite-food pizza --favorite-food="pizza"'))
            .toStrictEqual([
                ['-f pizza', '-f', 'pizza'],
                ['-f="pizza"', '-f', '"pizza"'],
                ['--favorite-food pizza', '--favorite-food', 'pizza'],
                ['--favorite-food="pizza"', '--favorite-food', '"pizza"']
            ]);

        expect(parse('---')).toStrictEqual([]);
    });
});