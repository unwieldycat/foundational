// ================= Imports ================= //

import { Application, Command, Option } from './interfaces';
import { deepFreeze } from './utilities';

// =============== Application =============== //

export default function application(): Application {

    // ------------ Private Properties ------------ //

    /** @access private */
    const _commands: Command[] = [];

    /** @access private */
    const _options: Option[] = [];

    // -------------- Input Parsing -------------- //

    /**
     * @access private
     * @param input
     */
    const _parseArguments = (spec: string, exec: string[]): Record<string, unknown> => {
        const args = {};
        const specMatch = spec.match(/^((?:<\w*> ?)*)(\[\w*\])?$/gm);
        if (specMatch) {
            const requiredKeys = specMatch[1].replace(/[[\]<>]+/g, '').trim().split(' ');
            requiredKeys.forEach((key, index) => {
                if (!exec[index]) throw new Error(`Missing required argument: ${key}`);
                Object.defineProperty(args, key, { value: exec[index] });
            });

            if (specMatch[2]) {
                // stuff
            }
        }
        return args;
    };

    /**
     * @access private
     * @param input
     */
    const _parseOptions = (input: string[]): Record<string, string> => {
        const options = {};

        for (const arg of input) {
            // im proud of this mean ass regex
            const regexMatch = arg.match(/^(--?[\w-]*)([= ]?)((?:\w*|"[^"]*"))$/gm);
            if (!regexMatch || regexMatch.length <= 0) continue;

            const optionKey = regexMatch[1];
            const optionValue = regexMatch[2];

            const optionMeta = _options.find((e) => {
                return e.name === optionKey || e.alias?.includes(optionKey);
            });

            Object.defineProperty(options, optionKey, {
                value: optionMeta?.flag ? true : optionValue
            });
        }

        return options;
    };

    // ---------------- Validation ---------------- //

    /**
     * @access private
     * @param command
     */
    const _validateCommand = (command: Command): void => {
        if (_commands.find((e) => e.name === command.name)) {
            throw new Error(`Command ${command.name} already exists`);
        }
        
        if (command.options) {
            _validateOptions(command.options);
            command.options.forEach((o) => {
                if (_options.find((e) => e.name === o.name)) {
                    throw new Error(`Option ${o.name} already exists in global options`);
                }
            });
        }

        if (command.arguments && !/^((?:<\w*> ?)*)(\[\w*\])?$/gm.test(command.arguments)) {
            throw new Error(`Arguments for command ${command.name} are formatted incorrectly`);
        }
    };

    /**
     * @access private
     * @param optionArray
     */
    const _validateOptions = (optionArray: Option[]): void => {
        for (const option of optionArray) {
            if (!/^--(\w*)$/.test(option.name)) {
                throw new Error(`Option "${option.name}" has an incorrectly formatted name`);
            }

            if (!option.alias) continue;
            for (const alias of option.alias) {
                if (!/^-(\w)$/.test(alias)) {
                    throw new Error(`Alias "${alias}" for option ${option.name} is formatted incorrectly`);
                }
            }
        }
    };

    // -------------- Public Methods -------------- //

    /**
     * Register a command
     * @param command Command configuration
     * @returns Command object
     */
    const command = (command: Command): void => {
        _validateCommand(command);
        _commands.push(command);
    };

    /**
     * Specify global options
     * @param options Command options/configuration
     * @returns Command object
     */
    const globalOptions = (...options: Option[]): void => {
        _validateOptions(options);
        options.forEach((e) => _options.push(e));
    };

    /**
     * Parse console input & run
     * @param input
     */
    const run = (input: string[] = process.argv): void => {
        const options = _parseOptions(input);
        console.log(options);
    };

    // -------------- Return Object -------------- //

    return deepFreeze({
        _options,
        _commands,
        _parseOptions,
        command,
        globalOptions,
        run
    });
}
