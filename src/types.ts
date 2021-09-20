// =============== Interfaces =============== //

export interface Application {
    /**
     * Register a command
     * @param command Command configuration
     * @returns void
     */
    command: (command: Command) => void;

    /**
     * Register multiple commands
     * @param commands Commands to register
     * @returns void
     */
    commands: (...commands: Command[]) => void;

    /**
     * Specify global options to be used for all commands
     * @param options Command options
     * @returns void
     */
    globalOptions: (...options: Option[]) => void;

    /**
     * Specify global flags to be used for all commands
     * @param flags Command flags
     * @returns void
     */
    globalFlags: (...flags: Flag[]) => void;

    /**
     * Parse console input & run
     * @param input User input
     * @returns void
     */
    run: (input?: string[]) => void;
}

export interface ApplicationSpec {
    /** Disable the help option */
    disableHelpOption?: boolean;
}

export interface Command {
    /** Name of command */
    name: string;

    /** Description that shows up in help menu */
    description?: string;

    /** Command arguments string */
    arguments?: string;

    /** Command-specific options */
    options?: Array<Option>;

    /** Command-specific flags */
    flags?: Array<Flag>;

    /**
     * The command's functionality
     * @param ctx Object of command arguments and options specified by the user
     * @returns unknown
     */
    action: (ctx: CommandActionContext) => unknown;
}

export interface CommandActionContext {
    /** Options and flags specified by the user */
    options: Record<string, string | boolean>;

    /** Arguments specified by the user */
    arguments: Record<string, string>;
}

export interface Option {
    /** Name of option in proper format (i.e. --option-name) */
    name: string;

    /** Alias of option in proper format (i.e. -o) */
    alias?: string;

    /** Description that appears in help menu */
    description: string;

    /** Default value if not specified by user */
    default?: string | boolean;
}

export interface Flag {
    /** Name of flag in proper format (i.e. --flag-name) */
    name: string;

    /** Alias of option in proper format (i.e. -f) */
    alias?: string;

    /** Description that shows up in help menu */
    description?: string;
}
