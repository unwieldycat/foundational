// ================================= Import ================================= //

import { assertEquals, assertStrictEquals } from "testing";
import { matchAll } from "../src/utilities.ts";
import regexes from "../src/regexes.ts";

// =========================== Test Option Regexp =========================== //

Deno.test("option alias validator", () => {
	assertEquals(regexes.aliasValidate.test("-a"), true);
	assertEquals(regexes.aliasValidate.test("-ab"), true);
	assertEquals(regexes.aliasValidate.test("-abc"), false);
	assertEquals(regexes.aliasValidate.test("--abc"), false);
	assertEquals(regexes.aliasValidate.test("-"), false);
});

Deno.test("option name validator", () => {
	assertEquals(regexes.optionValidate.test("--abc"), true);
	assertEquals(regexes.optionValidate.test("--abc-d"), true);
	assertEquals(regexes.optionValidate.test("--abc.d"), true);
	assertEquals(regexes.optionValidate.test("-abc"), false);
	assertEquals(regexes.optionValidate.test("-a"), false);
	assertEquals(regexes.optionValidate.test("--"), false);
});

Deno.test("option parsing", () => {
	const parse = (s: string): string[][] => matchAll(regexes.optionParse, s);

	assertStrictEquals(
		parse(
			'-f pizza -f="pizza" --favorite-food pizza --favorite.food pizza --favorite-food="pizza"',
		),
		[
			["-f pizza", "-f", "pizza"],
			['-f="pizza"', "-f", '"pizza"'],
			["--favorite-food pizza", "--favorite-food", "pizza"],
			["--favorite.food pizza", "--favorite.food", "pizza"],
			['--favorite-food="pizza"', "--favorite-food", '"pizza"'],
		],
	);

	assertStrictEquals(parse("--- -- hi"), []);
});
