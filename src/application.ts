// ================================ Imports ================================ //

import { parseArguments, parseOptions } from "./parsing.ts";
import { deepFreeze, maxLength, padStringTo } from "./utilities.ts";
import { Application, ApplicationSpec, Command, Option } from "./types.ts";
import regexes from "./regexes.ts";

// ============================== Application ============================== //

/**
 * Application constructor
 * @param spec - Application configuration
 * @returns Application object
 */
export function application(spec?: ApplicationSpec): Application {
	const _helpOptionEnabled = !spec?.disableHelpOption;
	const _version = spec?.version;

	const _commands: Command[] = [];
	const _options: Option[] = [];

	// -------------------- Option & Command Validation -------------------- //

	const _validateCommand = (command: Command): void => {
		if (command.name.length <= 0) throw new Error("Command names must be at least 1 character");
		if (_commands.find((e) => e.name === command.name)) {
			throw new Error(`Command ${command.name} already exists`);
		}
		if (command.options) _validateOptions(command.options);

		if (command.arguments) {
			if (!regexes.argumentParse.test(command.arguments)) {
				throw new Error(`Arguments for command ${command.name} are formatted incorrectly`);
			}

			if (command.arguments.includes("__proto__")) {
				throw new Error(`Arguments cannot be named "__proto__"`);
			}
		}
	};

	const _validateOptions = (optionArray: Option[]): void => {
		for (const option of optionArray) {
			if (_options.find((e) => e.name === option.name)) {
				throw new Error(`Option ${option.name} already exists in global options`);
			}

			if (!regexes.optionValidate.test(option.name)) {
				throw new Error(`Option "${option.name}" has an incorrectly formatted name`);
			}

			if (!option.alias) continue;

			if (_options.find((e) => e.alias === option.alias)) {
				throw new Error(
					`Option ${option.name} already exists in global options, or it's alias is already in use`,
				);
			}

			if (!regexes.aliasValidate.test(option.alias)) {
				throw new Error(
					`Alias "${option.alias}" for option ${option.name} is formatted incorrectly`,
				);
			}

			if (option.name === "__proto__") {
				throw new Error(`Option "${option.name}" has illegal name`);
			}
		}
	};

	// --------------------------- Version Option --------------------------- //

	if (_version) {
		_options.push({
			name: "--version",
			alias: "-v",
			description: "Display the app version",
			flag: true,
		});
	}

	// --------------------------- Help Rendering --------------------------- //

	const _help = (command?: Command) => {
		const optionsList: string[] = [];

		[...(command?.options || []), ..._options].forEach((o: Option) => {
			optionsList.push(`${o.name} ${o.alias || ""}`.trim());
		});

		const optionsPadLength = maxLength(optionsList) + 2;

		optionsList.forEach((s, i) => {
			const optionName = s.split(" ")[0];
			const optionMeta = [...(command?.options || []), ..._options].find((o) =>
				o.name === optionName
			);
			optionsList[i] = padStringTo(s, optionsPadLength) + (optionMeta?.description || "");
		});

		if (command) {
			const usage: string[] = [];

			usage.push(command.name);
			if (command.arguments) usage.push(command.arguments);

			console.log(
				`Usage: ${usage.join(" ")}\n\n` +
					`    ${command.description}\n\n` +
					`Options:\n    ${optionsList.join("\n    ")}\n`,
			);
		} else {
			const commandsList: string[] = [];

			_commands.forEach((c: Command) => {
				commandsList.push(`${c.name} ${c.arguments || ""}`.trim());
			});

			const commandsPadLength = maxLength(commandsList) + 2;

			commandsList.forEach((s, i) => {
				const commandName = s.split(" ")[0];
				const commandMeta = _commands.find((c) => c.name === commandName);
				commandsList[i] = padStringTo(s, commandsPadLength) + (commandMeta?.description || "");
			});

			console.log(
				`Commands:\n    ${commandsList.join("\n    ")}\n\nOptions:\n    ${
					optionsList.join("\n    ")
				}\n`,
			);
		}
	};

	if (_helpOptionEnabled) {
		_options.push({
			name: "--help",
			alias: "-h",
			description: "Display help menu",
			flag: true,
		});
	}

	// --------------------------- Public Methods --------------------------- //

	const command = (command: Command): void => {
		_validateCommand(command);
		_commands.push(command);
	};

	const commands = (...commands: Command[]): void => {
		commands.forEach((c) => {
			command(c);
		});
	};

	const options = (...options: Option[]): void => {
		_validateOptions(options);
		options.forEach((e) => _options.push(e));
	};

	const run = (input: string[] = Deno.args): void => {
		const command = _commands.find((c) => c.name === input[0]);
		const options = parseOptions(input, [..._options, ...(command?.options || [])]);

		if (options.version && _version) {
			console.log(_version);
			return;
		}

		// A hack to remove all options from input, due to a
		// limitation with iterating over the array instead
		const providedArgs = (command ? input.slice(1) : input).join(" ").replace(
			regexes.optionParse,
			"",
		).split(" ");

		if (!command) {
			if (_helpOptionEnabled) _help();
			return;
		}

		if (options.help && _helpOptionEnabled) {
			_help(command);
			return;
		}

		const args = parseArguments(
			command.arguments || "",
			providedArgs,
		);

		command.action({ arguments: args, options: options });
	};

	// ------------------------ Return frozen object ------------------------ //

	return deepFreeze({
		command,
		commands,
		options,
		run,
	});
}
