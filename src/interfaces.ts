// =============== Interfaces =============== //

export interface Application {
    command: (command: Command) => void;
    globalOptions: (...options: Option[]) => void;
    run: (input: string[]) => void;
}

export interface ApplicationSpec {
    name: string;
    defaultHelpCommand?: boolean;
}

export interface Command {
    name: string;
    arguments?: string;
    options?: Array<Option>;
    action: (ctx: CommandActionContext) => unknown;
}

export interface CommandActionContext {
    options: Map<string, unknown>;
    arguments: string[];
}

export interface Option {
    name: string;
    alias?: string;
    flag: boolean;
    description: string;
    default?: string | boolean;
}
