// ================= Import ================= //

import { deepFreeze, define } from '../src/utilities';

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
