// ================= Import ================= //

import { matchAll } from '../src/utilities';
import regexes from '../src/regexes';

// ============== Test Regexes ============== //

test('argument parsing', () => {
    const parse = (s: string): string[][] => matchAll(regexes.argumentParse, s);

    expect(parse('<arg1> <arg2> [arg3...]'))
        .toStrictEqual([
            ['<arg1> <arg2> [arg3...]', '<arg1> <arg2> ', '[arg3...]']
        ]);

    expect(parse('<arg1> <arg2...>'))
        .toStrictEqual([
            ['<arg1> <arg2...>', '<arg1> ', '<arg2...>']
        ]);

    expect(parse('<arg1...> [arg2...]')).toStrictEqual([]);
    expect(parse('<arg1> [arg2] <arg3>')).toStrictEqual([]);
});