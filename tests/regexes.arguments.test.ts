// ================================= Import ================================= //

import { assertStrictEquals } from "testing";
import { matchAll } from "../src/utilities.ts";
import regexes from "../src/regexes.ts";

// ========================= Test Arguments Regexp ========================= //

Deno.test("argument parsing", () => {
	const parse = (s: string): string[][] => matchAll(regexes.argumentParse, s);

	assertStrictEquals(parse("<arg1> <arg2> [arg3...]"), [[
		"<arg1> <arg2> [arg3...]",
		"<arg1> <arg2> ",
		"[arg3...]",
	]]);

	assertStrictEquals(parse("<arg1> <arg2...>"), [["<arg1> <arg2...>", "<arg1> ", "<arg2...>"]]);

	assertStrictEquals(parse("<arg1...> [arg2...]"), []);
	assertStrictEquals(parse("<arg1> [arg2] <arg3>"), []);
});
