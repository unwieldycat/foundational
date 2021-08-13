// ================= Import ================= //

import { deepFreeze, define, matchAll, maxLength } from '../src/utilities';

// ============= Test deepFreeze ============= //

describe('test deepFreeze function', () => {
    it('should freeze nested arrays', () => {
        const testObj = deepFreeze({ a: [1, 2, 3, [4, 5]] });
        expect(Object.isFrozen(testObj)).toBe(true);
        expect(Object.isFrozen(testObj.a)).toBe(true);
    });

    it('should freeze nested objects', () => {
        const testObj = deepFreeze({ a: { a: 1, b: { a: 2 }}});
        expect(Object.isFrozen(testObj)).toBe(true);
        expect(Object.isFrozen(testObj.a.b)).toBe(true);
    });
});

// =============== Test define =============== //

describe('test define function', () => {
    it('should add properties to an object', () => {
        const testObj = {};
        define(testObj, 'a', true);
        expect(testObj).toStrictEqual({ a: true });
    });

    it('shouldn\'t allow adding __proto__ as a key', () => {
        const testObj = {};
        define(testObj, '__proto__', {});
        expect(testObj).toStrictEqual({});
    });
});

// ============== Test matchAll ============== //

describe('test matchAll function', () => {
    it('should return all matches and groups', () => {
        expect(matchAll(/(a)(b)/g, 'abcabcabc')).toStrictEqual([['ab', 'a', 'b'], ['ab', 'a', 'b'], ['ab', 'a', 'b']]);
    });

    it('should avoid memory leaks', () => {
        expect(matchAll(/(a)(b)/g, '')).toStrictEqual([]);
        expect(matchAll(/(a)(b)/, 'abcabcabc')).toStrictEqual([['ab', 'a', 'b'], ['ab', 'a', 'b'], ['ab', 'a', 'b']]);
    });
});

// ============= Test maxLength ============= //

describe('test maxLength function', () => {
    it('should return the length of the longest string', () => {
        expect(maxLength(['123', '12345'])).toBe(5);
        expect(maxLength([''])).toBe(0);
    });
});
