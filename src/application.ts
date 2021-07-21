// ================= Imports ================= //

import { Application, Command, Option } from './interfaces';
import { deepFreeze, define, matchAll } from './utilities';
import regexes from './regexes';

// =============== Application =============== //

export default function application(): Application {
    // ------------ Private Properties ------------ //

    const _commands: Command[] = [];
    const _options: Option[] = [];

    // -------------- Input Parsing -------------- //

    const _parseArguments = (spec: string, providedArgs: string[]): Record<string, unknown> => {
        const args = {};

        const keys = matchAll(regexes.argParse, spec);
        if (!keys) return args;

        for (const match of keys) {
            const requiredKeys = match[1].trim().split(' ');
            const optionalKey = match[2];

            requiredKeys.forEach((key, index) => {
                if (!providedArgs[index]) throw new Error(`Missing argument: ${key}`);
                define(args, key, providedArgs[index]);
            });

            // requiredKeys.length is passed in because
            // it's the last index of the array + 1
            // (due to arrays starting at 0)
            if (optionalKey && providedArgs[requiredKeys.length]) {
                define(args, optionalKey, providedArgs[requiredKeys.length]);    
            }  
        }

        return args;
    };

    const _parseOptions = (exec: string[]): Record<string, string> => {
        const options = {};
        const stringified = exec.join(' ');
        const regexMatch = matchAll(regexes.optionParse, stringified);

        for (const match of regexMatch) {
            const optionKey = match[1];
            const optionValue = match[2];
            const optionMeta = _options.find((e) => {
                return e.name === optionKey || e.alias === optionKey;
            });

            if (optionMeta) define(options, optionKey, optionValue);
        }

        return options;
    };

    // ---------------- Validation ---------------- //

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

        if (command.arguments && !regexes.argValidate.test(command.arguments)) {
            throw new Error(`Arguments for command ${command.name} are formatted incorrectly`);
        }
    };

    const _validateOptions = (optionArray: Option[]): void => {
        for (const option of optionArray) {
            if (!regexes.optionValidate.test(option.name)) {
                throw new Error(`Option "${option.name}" has an incorrectly formatted name`);
            }

            if (!option.alias) continue;
            if (!regexes.aliasValidate.test(option.alias)) {
                throw new Error(`Alias "${option.alias}" for option ${option.name} is formatted incorrectly`);
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
        //const args = _parseArguments(input);
        console.log(options);
    };

    // -------------- Return Object -------------- //

    return deepFreeze({
        command,
        globalOptions,
        run
    });
}
