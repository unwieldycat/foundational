// =============== Interfaces =============== //

export interface Application {
    command: (command: Command) => void;
    globalOptions: (...options: Option[]) => void;
    run: (input?: string[]) => void;
}

export interface ApplicationSpec {
    name: string;
    helpOption?: boolean;
}

export interface Command {
    name: string;
    arguments?: string;
    options?: Array<Option>;
    action: (ctx: CommandActionContext) => unknown;
}

export interface CommandActionContext {
    options: Record<string, string | boolean>;
    arguments: Record<string, string>;
}

export interface Option {
    name: string;
    alias?: string;
    flag?: boolean;
    description: string;
    default?: string | boolean;
}
