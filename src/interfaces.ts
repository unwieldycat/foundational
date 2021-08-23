// =============== Interfaces =============== //

export interface Application {
    command: (command: Command) => void;
    globalOptions: (...options: Option[]) => void;
    run: (input?: string[]) => void;
}

export interface ApplicationSpec {
    helpOption?: boolean;
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
