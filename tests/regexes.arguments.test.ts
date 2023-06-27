// ================================= Import ================================= //

import { assertEquals } from "testing";
import { matchAll } from "../src/utilities.ts";
import regexes from "../src/regexes.ts";

// ========================= Test Arguments Regexp ========================= //

Deno.test("argument parsing", () => {
	const parse = (s: string): string[][] => matchAll(regexes.argumentParse, s);

	assertEquals(parse("<arg1> <arg2> [arg3...]"), [[
		"<arg1> <arg2> [arg3...]",
		"<arg1> <arg2> ",
		"[arg3...]",
	]]);

	assertEquals(parse("<arg1> <arg2...>"), [["<arg1> <arg2...>", "<arg1> ", "<arg2...>"]]);

	assertEquals(parse("<arg1...> [arg2...]"), []);
	assertEquals(parse("<arg1> [arg2] <arg3>"), []);
});
