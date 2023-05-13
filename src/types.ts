// =============================== Interfaces =============================== //

/** Object of functions used to build the CLI */
export interface Application {
    /**
     * Register a command
     * @param command - Command configuration
     * @returns void
     * @example
     * ```ts
     * app.command({
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
     * Specify global options to be used for all commands
     * @param options - Command options
     * @returns void
     * @example
     * ```ts
     * app.globalOptions(
     *     {
     *         name: '--verbose',
     *         description: 'Verbose application output',
     *         alias: '-r',
     *         flag: true
     *     }
     * );
     * ```
     */
    globalOptions: (...options: Option[]) => void;

    /**
     * Parse console input & run
     * @param input - User input
     * @returns void
     */
    run: (input?: string[]) => void;
}

/** Application configuration */
export interface ApplicationSpec {
    /** App version that shows up in --version */
    version: string;

    /** Disable the help option */
    disableHelpOption?: boolean;
}

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
    action: (ctx: CommandActionContext) => unknown;
}

/** Arguments & options from the CLI input */
export interface CommandActionContext {
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
