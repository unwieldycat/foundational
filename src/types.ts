// =============================== Interfaces =============================== //

/** Action function type */
export type Action = (ctx: ActionContext) => unknown;

/** Command object */
export interface Command {
	/** Name of command */
	name: string;

	/** Description that shows up in help menu */
	description?: string;

	/** Command arguments string */
	arguments?: string;

	/** Command-specific options */
	options?: Array<Option>;

	/**
	 * The command's functionality
	 * @param ctx - Object of command arguments and options specified by the user
	 * @returns unknown
	 */
	action: Action;
}

/** Arguments & options from the CLI input */
export interface ActionContext {
	/** Options and flags specified by the user */
	options: Record<string, string | boolean>;

	/** Arguments specified by the user */
	arguments: Record<string, string>;
}

/** Option object */
export interface Option {
	/** Name of option in proper format (ex: --option-name) */
	name: string;

	/** True if option has a boolean value */
	flag?: boolean;

	/** Alias of option in proper format (ex: -o) */
	alias?: string;

	/** Description that appears in help menu */
	description?: string;

	/** Default value if not specified by user */
	default?: string | boolean;
}
