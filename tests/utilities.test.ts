// ================================= Import ================================= //

import { assertEquals, assertStrictEquals } from "testing";
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
	assertStrictEquals(testObj, { a: true });

	// It shouldn't allow adding __proto__ as a key
	define(testObj, "__proto__", {});
	assertStrictEquals(testObj, { a: true });
});

Deno.test("matchAll function", () => {
	// It should return all matches and groups
	assertStrictEquals(matchAll(/(a)(b)/g, "abcabcabc"), [
		["ab", "a", "b"],
		["ab", "a", "b"],
		["ab", "a", "b"],
	]);

	// It should avoid memory leaks
	assertStrictEquals(matchAll(/(a)(b)/g, ""), []);
	assertStrictEquals(matchAll(/(a)(b)/, "abcabcabc"), [
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
	assertStrictEquals(padStringTo("hi", 3), "hi ");
	assertStrictEquals(padStringTo("hi", 3, true), " hi");

	// It should silently reject numbers lower than string length
	assertStrictEquals(padStringTo("hi", 0), "hi");
	assertStrictEquals(padStringTo("hi", 1), "hi");
	assertStrictEquals(padStringTo("hi", 2), "hi");
});

Deno.test("removeFromArray function", () => {
	// It should remove all instances of a string from an array
	assertStrictEquals(removeFromArray(["STEVE", "STEVE", "STEVE!!!!"], /STEVE/), []);
	assertStrictEquals(removeFromArray(["123", "456", "789"], /1/), ["456", "789"]);
});

Deno.test("camelCase function", () => {
	assertStrictEquals(camelCase([]), "");
	assertStrictEquals(camelCase(["camel", "case", "rocks"]), "camelCaseRocks");
});
