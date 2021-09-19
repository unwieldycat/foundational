// =============== Interfaces =============== //

export interface Application {
    /**
     * Register a command
     * @param command Command configuration
     * @returns void
     */
    command: (command: Command) => void;

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
    disableHelpOption?: boolean;
}

export interface Command {
    name: string;
    description?: string;
    arguments?: string;
    options?: Array<Option>;
    flags?: Array<Flag>;
    action: (ctx: CommandActionContext) => unknown;
}

export interface CommandActionContext {
    options: Record<string, string | boolean>;
    arguments: Record<string, string>;
}

export interface Option {
    name: string;
    alias?: string;
    description: string;
    default?: string | boolean;
}

export interface Flag {
    name: string;
    alias?: string;
    description?: string;
}
