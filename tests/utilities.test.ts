// ================= Import ================= //

import { deepFreeze } from '../src/utilities';

// ============= Test deepFreeze ============= //

describe('test deepFreeze function', () => {
    it('should freeze nested arrays', () => {
        const testObj = deepFreeze({ a: [1, 2, 3, [4, 5]] });
        expect(Object.isFrozen(testObj)).toBe(true);
        expect(Object.isFrozen(testObj.a)).toBe(true);
        expect(testObj.a.push(4)).toThrow();
        expect(testObj.a[3][1] = 6).toThrow();
    });

    it('should freeze nested objects', () => {
        const testObj = deepFreeze({ a: { a: 1, b: { a: 2 }}});
        expect(Object.isFrozen(testObj)).toBe(true);
        expect(Object.isFrozen(testObj.a.b)).toBe(true);
    });
});
