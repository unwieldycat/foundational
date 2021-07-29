// ================= Import ================= //

import regexes from '../src/regexes';

// ============== Test Regexes ============== //

describe('test all regexes', () => {

    // ------------ Validation Regexes ------------ //

    it('should validate proper command aliases', () => {
        expect(regexes.aliasValidate.test('-a')).toBe(true);
        expect(regexes.aliasValidate.test('-abc')).toBe(false);
        expect(regexes.aliasValidate.test('--abc')).toBe(false);
        expect(regexes.aliasValidate.test('-')).toBe(false);
    });

    it('should validate proper command names', () => {
        expect(regexes.aliasValidate.test('--abc')).toBe(true);
        expect(regexes.aliasValidate.test('-abc')).toBe(false);
        expect(regexes.aliasValidate.test('-a')).toBe(false);
        expect(regexes.aliasValidate.test('--')).toBe(false);
    });

    // ------------- Parsing Regexes ------------- //
});