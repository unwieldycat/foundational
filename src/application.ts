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

    /**
     * @access private
     * @param input
     */
    const _parseArguments = (spec: string, exec: string[]): Record<string, unknown> => {
        const args = {};

        const keys = spec.match(regexes.argParse);
        if (!keys) return args;

        const requiredKeys = keys[1].trim().split(' ');
        const optionalKeys = keys[2];

        requiredKeys.forEach((key, index) => {
            if (!exec[index]) throw new Error(`Missing argument: ${key}`);
            define(args, key, exec[index]);
        });

        return args;
    };

    /**
     * @access private
     * @param input
     */
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

        if (command.arguments && !regexes.argValidate.test(command.arguments)) {
            throw new Error(`Arguments for command ${command.name} are formatted incorrectly`);
        }
    };

    /**
     * @access private
     * @param optionArray
     */
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
