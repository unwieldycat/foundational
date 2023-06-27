// ================================ Imports ================================ //

import regexes from "./regexes.ts";
import { camelCase, define, matchAll } from "./utilities.ts";
import { Option } from "./types.ts";

// =========================== Parsing Functions =========================== //

export function parseArguments(spec: string, providedArgs: string[]): Record<string, string> {
	const args = {};

	const keys = spec.match(regexes.argumentParse);
	if (!keys) return args;

	const required = (() => {
		const s = keys[1].trim().replace(/[<>]/g, "");
		const a = s.length > 0 ? s.split(" ") : [];
		return a;
	})();

	const last = keys[2]?.replace(/[[\]<>.]/g, "");

	required.forEach((key, index) => {
		if (!providedArgs[index]) throw new Error(`Missing argument: ${key}`);
		define(args, key, providedArgs[index]);
	});

	if (last) {
		// required.length is passed in down here
		// because it's the last index of the
		// array + 1
		if (providedArgs[required.length]) {
			define(
				args,
				last,
				keys[2]?.includes("...") // Checks if last is variadic
					? providedArgs.slice(required.length).join(" ").trimEnd()
					: providedArgs[required.length],
			);
		} else if (!/[[\]]/g.test(keys[2])) {
			// Checks if last is not optional
			throw new Error(`Missing argument: ${last}`);
		}
	}

	return args;
}

export function parseOptions(
	exec: string[],
	commandOptions: Option[],
): Record<string, string | boolean> {
	const options = {};
	const stringified = exec.join(" ");
	const regexMatch = matchAll(regexes.optionParse, stringified);

	for (const match of regexMatch) {
		const optionKey = match[1];

		const optionMeta = commandOptions.find((e) => {
			return e.name === optionKey || e.alias === optionKey;
		});

		if (!optionMeta) continue;

		const optionKeyCamel = camelCase(
			optionMeta.name.substring(2)
				.replaceAll(".", " ")
				.replaceAll("-", " ")
				.trim()
				.split(" "),
		);

		const defaultValue = optionMeta.flag ? false : optionMeta.default;
		const optionValue = optionMeta.flag || (match[2] || "").replace(/(^")|("$)/g, "");

		define(options, optionKeyCamel, optionValue || defaultValue);
		define(options, optionMeta.name, optionValue || defaultValue);
	}

	return options;
}
