// =============== Interfaces =============== //

export interface Application {
    _commands: Command[];
    _options: Option[];
    command: (command: Command) => void;
    globalOptions: (...options: Option[]) => void;
}

export interface Command {
    name: string;
    arguments?: string;
    options?: Array<Option>;
    action: (ctx: CommandActionContext) => unknown;
}

export interface CommandSpec {
    name: string;
    arguments?: string;
    options?: Array<Option>;
    action: (ctx: CommandActionContext) => unknown;
}

export interface CommandActionContext {
    options: Map<string, unknown>;
    arguments: string[];
}

export type OptionType = 'boolean' | 'string';

export interface Option {
    name: string;
    alias?: string;
    type: OptionType;
    description: string;
    default?: string | boolean;
}
