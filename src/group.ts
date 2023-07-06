import { Command, Option } from "./types.ts";
import regexes from "./regexes.ts";
import { parseArguments, parseOptions } from "./parsing.ts";
import { maxLength, padStringTo } from "./utilities.ts";

// ================================= Types ================================= //

export interface IGroup {
	/**
	 * Register a command
	 * @param command - Command configuration
	 * @returns void
	 * @example
	 * ```ts
	 * group.command({
	 *     name: 'my-command',
	 *     description: 'Command example',
	 *     options: [
	 *         {
	 *             name: '--my-option',
	 *             description: 'Option example',
	 *             alias: '-o'
	 *         }
	 *     ],
	 *     action: (ctx) => {
	 *         // ...
	 *     }
	 * });
	 * ```
	 */
	command: (command: Command) => void;

	/**
	 * Register multiple commands
	 * @param commands - Commands to register
	 * @returns void
	 */
	commands: (...commands: Command[]) => void;

	/**
	 * Add a sub-group
	 * @param name Name of the group
	 * @param group Group object
	 * @returns
	 */
	group: (name: string, group: Group) => void;
}

export interface GroupSpec {
	/**
	 * Global options to be used for all commands in groups and subsequent groups
	 */
	options?: Option[];
}

// ============================== Group Class ============================== //

export class Group implements IGroup {
	protected _groups: Map<string, Group>;
	protected _options: Option[];
	protected _commands: Command[];

	// ------------------------- Protected Methods ------------------------- //

	protected _help(command?: Command) {
		const optionsList: string[] = [];

		[...(command?.options || []), ...this._options].forEach((o: Option) => {
			optionsList.push(`${o.name} ${o.alias || ""}`.trim());
		});

		const optionsPadLength = maxLength(optionsList) + 2;

		optionsList.forEach((s, i) => {
			const optionName = s.split(" ")[0];
			const optionMeta = [...(command?.options || []), ...this._options].find((o) =>
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

			this._commands.forEach((c: Command) => {
				commandsList.push(`${c.name} ${c.arguments || ""}`.trim());
			});

			// FIXME: Allow groups to have descriptions somehow
			this._groups.forEach((_g, n: string) => {
				commandsList.push(n);
			});

			const commandsPadLength = maxLength(commandsList) + 2;

			commandsList.forEach((s, i) => {
				const commandName = s.split(" ")[0];
				const commandMeta = this._commands.find((c) => c.name === commandName);
				commandsList[i] = padStringTo(s, commandsPadLength) + (commandMeta?.description || "");
			});

			console.log(
				`Commands:\n    ${commandsList.join("\n    ")}\n\nOptions:\n    ${
					optionsList.join("\n    ")
				}\n`,
			);
		}
	}

	protected _run(input: string[] = Deno.args) {
		const command = this._commands.find((c) => c.name === input[0]);

		if (!command) {
			const group = this._groups.get(input[0]);

			if (!group) {
				this._help();
				return;
			}

			group._run(input.slice(1));
			return;
		}

		const options = parseOptions(input, [...this._options, ...(command?.options || [])]);

		if (options.help) {
			this._help(command);
			return;
		}

		// A hack to remove all options from input, due to a
		// limitation with iterating over the array instead
		const providedArgs = (command ? input.slice(1) : input).join(" ").replace(
			regexes.optionParse,
			"",
		).split(" ");

		const args = parseArguments(
			command.arguments || "",
			providedArgs,
		);

		command.action({ arguments: args, options: options });
	}

	protected _validateCommand = (command: Command): void => {
		if (command.name.length <= 0) throw new Error("Command names must be at least 1 character");
		if (this._commands.find((e) => e.name === command.name)) {
			throw new Error(`Command ${command.name} already exists`);
		}
		if (command.options) this._validateOptions(command.options);

		if (command.arguments) {
			if (!regexes.argumentParse.test(command.arguments)) {
				throw new Error(`Arguments for command ${command.name} are formatted incorrectly`);
			}

			if (command.arguments.includes("__proto__")) {
				throw new Error(`Arguments cannot be named "__proto__"`);
			}
		}
	};

	protected _validateOptions = (optionArray: Option[]): void => {
		for (const option of optionArray) {
			if (this._options.find((e) => e.name === option.name)) {
				throw new Error(`Option ${option.name} already exists in global options`);
			}

			if (!regexes.optionValidate.test(option.name)) {
				throw new Error(`Option "${option.name}" has an incorrectly formatted name`);
			}

			if (!option.alias) continue;

			if (this._options.find((e) => e.alias === option.alias)) {
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

	// ---------------------------- Constructor ---------------------------- //

	constructor(spec?: GroupSpec) {
		this._commands = [];
		this._options = [];
		this._groups = new Map();

		if (spec?.options) {
			this._validateOptions(spec.options);
			this._options.push(...spec.options);
		}
	}

	// --------------------------- Public Methods --------------------------- //

	command(command: Command) {
		this._validateCommand(command);
		this._commands.push(command);
	}

	commands(...commands: Command[]) {
		commands.forEach((c) => {
			this.command(c);
		});
	}

	group(name: string, group: Group) {
		group._options.push(...this._options);
		this._groups.set(name, group);
	}
}
