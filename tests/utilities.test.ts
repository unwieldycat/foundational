// ================================= Import ================================= //

import { assertEquals } from "testing";
import {
	camelCase,
	deepFreeze,
	define,
	matchAll,
	maxLength,
	padStringTo,
	removeFromArray,
} from "../src/utilities.ts";

// ========================= Test Utility Functions ========================= //

Deno.test("deepFreeze function", () => {
	const testObj = deepFreeze({ a: [1, 2, 3, [4, 5]], b: { a: 1, b: { a: 2 } } });

	// it should freeze nested arrays
	assertEquals(Object.isFrozen(testObj), true);
	assertEquals(Object.isFrozen(testObj.a), true);

	// It should freeze nested objects
	assertEquals(Object.isFrozen(testObj), true);
	assertEquals(Object.isFrozen(testObj.b.b), true);
});

Deno.test("define function", () => {
	const testObj = {};

	// It should add properties to an object
	define(testObj, "a", true);
	assertEquals(testObj, { a: true });

	// It shouldn't allow adding __proto__ as a key
	define(testObj, "__proto__", {});
	assertEquals(testObj, { a: true });
});

Deno.test("matchAll function", () => {
	// It should return all matches and groups
	assertEquals(matchAll(/(a)(b)/g, "abcabcabc"), [
		["ab", "a", "b"],
		["ab", "a", "b"],
		["ab", "a", "b"],
	]);

	// It should avoid memory leaks
	assertEquals(matchAll(/(a)(b)/g, ""), []);
	assertEquals(matchAll(/(a)(b)/, "abcabcabc"), [
		["ab", "a", "b"],
		["ab", "a", "b"],
		["ab", "a", "b"],
	]);
});

Deno.test("maxLength function", () => {
	// It should return the length of the longest string\
	assertEquals(maxLength(["123", "12345"]), 5);
	assertEquals(maxLength([""]), 0);
});

Deno.test("padStringTo function", () => {
	// It should pad a string to a desired length
	assertEquals(padStringTo("hi", 3), "hi ");
	assertEquals(padStringTo("hi", 3, true), " hi");

	// It should silently reject numbers lower than string length
	assertEquals(padStringTo("hi", 0), "hi");
	assertEquals(padStringTo("hi", 1), "hi");
	assertEquals(padStringTo("hi", 2), "hi");
});

Deno.test("removeFromArray function", () => {
	// It should remove all instances of a string from an array
	assertEquals(removeFromArray(["STEVE", "STEVE", "STEVE!!!!"], /STEVE/), []);
	assertEquals(removeFromArray(["123", "456", "789"], /1/), ["456", "789"]);
});

Deno.test("camelCase function", () => {
	assertEquals(camelCase([]), "");
	assertEquals(camelCase(["camel", "case", "rocks"]), "camelCaseRocks");
});
