import { ActionContext, Command, Middleware, NextFunction, Option } from "./types.ts";
import regexes from "./regexes.ts";
import { parseArguments, parseOptions } from "./parsing.ts";
import { maxLength, padStringTo } from "./utilities.ts";
import { error } from "./logging.ts";

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
	command: (command: Command) => IGroup;

	/**
	 * Register multiple commands
	 * @param commands - Commands to register
	 * @returns void
	 */
	commands: (...commands: Command[]) => IGroup;

	/**
	 * Add a sub-group
	 * @param name Name of the group
	 * @param group Group object
	 * @returns Igroup
	 */
	group: (name: string, group: Group) => IGroup;

	/**
	 * Register a middleware function
	 * @param middleware Middleware function
	 * @returns IGroup
	 */
	use: (middleware: Middleware) => IGroup;
}

export interface GroupSpec {
	/**
	 * Global options to be used for all commands in groups and subsequent groups
	 */
	options?: Option[];

	/**
	 * Description that shows up in the help menu for this group
	 */
	description?: string;
}

// ============================== Group Class ============================== //

export class Group implements IGroup {
	protected _groups: Map<string, Group>;
	protected _options: Option[];
	protected _commands: Command[];
	protected _description: string;
	protected _middlewares: Middleware[];

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

			const description = (command.description) ? `  ${command.description}\n\n` : "";

			console.log(
				`Usage: ${usage.join(" ")}\n\n` +
					description +
					`Options:\n  ${optionsList.join("\n  ")}\n`,
			);
		} else {
			const commandsList: string[] = [];

			this._commands.forEach((c: Command) => {
				commandsList.push(`${c.name} ${c.arguments || ""}`.trim());
			});

			this._groups.forEach((_g, n: string) => {
				commandsList.push(n);
			});

			const commandsPadLength = maxLength(commandsList) + 2;

			commandsList.forEach((s, i) => {
				const commandName = s.split(" ")[0];
				const commandMeta = this._commands.find((c) => c.name === commandName);
				const groupMeta = this._groups.get(commandName);
				const description = commandMeta?.description || groupMeta?._description || "";

				commandsList[i] = padStringTo(s, commandsPadLength) + description;
			});

			const description = (this._description) ? `${this._description}\n\n` : "";

			console.log(
				description +
					`Options:\n  ${optionsList.join("\n  ")}\n\n` +
					`Commands:\n  ${commandsList.join("\n  ")}\n`,
			);
		}
	}

	protected _run(input: string[] = Deno.args) {
		const command = this._commands.find((c) => c.name === input[0]);

		const { flags, options } = parseOptions(input, [...this._options, ...(command?.options || [])]);

		// A hack to remove all options from input, due to a
		// limitation with iterating over the array instead
		const providedArgs = (command ? input.slice(1) : input).join(" ").replace(
			regexes.optionParse,
			"",
		).split(" ");

		const args = parseArguments(
			command?.arguments || "",
			providedArgs,
		);

		// Middleware for the command action
		// This should be the last middleware, so next is ignored
		const actionMiddleware = (ctx: ActionContext, _next: NextFunction) => {
			if (!command) {
				const group = this._groups.get(input[0]);

				if (!group) {
					this._help();
					return;
				}

				group._run(input.slice(1));
				return;
			}

			if (flags?.help) {
				this._help(command);
				return;
			}

			command.action(ctx);
		};

		this.use(actionMiddleware);
		this._runMiddleware({ arguments: args, flags, options });
	}

	protected _runMiddleware(context: ActionContext) {
		const next = () => {
			const middleware = this._middlewares.shift();
			if (middleware) middleware(context, next);
		};

		next();
	}

	protected _validateCommand = (command: Command): void => {
		if (command.name.length <= 0) {
			error("Command names must be at least 1 character");
		}
		if (!regexes.commandValidate.exec(command.name)) {
			error("Command name has invalid characters");
		}
		if (this._commands.find((e) => e.name === command.name)) {
			error("Command ${command.name} already exists");
		}
		if (command.options) this._validateOptions(command.options);

		if (command.arguments) {
			if (!regexes.argumentParse.test(command.arguments)) {
				error(`Arguments for command ${command.name} are formatted incorrectly`);
			}

			if (command.arguments.includes("__proto__")) {
				error(`Arguments cannot be named "__proto__"`);
			}
		}
	};

	protected _validateGroup = (name: string, group: Group): void => {
		if (name.length <= 0) error("Group names must be at least 1 character");
		if (!regexes.commandValidate.exec(name)) {
			error("Group name has invalid characters");
		}
		if (group._commands.length <= 0) {
			error("Groups must contain at least 1 command");
		}
		if (group === this) error("Cannot make a group its own child");
	};

	protected _validateOptions = (optionArray: Option[]): void => {
		for (const option of optionArray) {
			if (this._options.find((e) => e.name === option.name)) {
				error(`Option ${option.name} already exists in global options`);
			}

			if (!regexes.optionValidate.test(option.name)) {
				error(` "${option.name}" has an incorrectly formatted name`);
			}

			if (!option.alias) continue;

			if (this._options.find((e) => e.alias === option.alias)) {
				error(
					`Option ${option.name} already exists in global options, or it's alias is already in use`,
				);
			}

			if (!regexes.aliasValidate.test(option.alias)) {
				error(
					`Alias "${option.alias}" for option ${option.name} is formatted incorrectly`,
				);
			}

			if (option.name === "__proto__") {
				error(`Option "${option.name}" has illegal name`);
			}
		}
	};

	// ---------------------------- Constructor ---------------------------- //

	constructor(spec?: GroupSpec) {
		this._commands = [];
		this._options = [];
		this._groups = new Map();
		this._description = spec?.description || "";
		this._middlewares = [];

		if (spec?.options) {
			this._validateOptions(spec.options);
			this._options.push(...spec.options);
		}
	}

	// --------------------------- Public Methods --------------------------- //

	command(command: Command) {
		this._validateCommand(command);
		this._commands.push(command);

		return this;
	}

	commands(...commands: Command[]) {
		commands.forEach((c) => {
			this.command(c);
		});

		return this;
	}

	group(name: string, group: Group) {
		this._validateGroup(name, group);
		group._options.push(...this._options);
		this._groups.set(name, group);

		return this;
	}

	use(middleware: Middleware) {
		this._middlewares.push(middleware);
		return this;
	}
}
