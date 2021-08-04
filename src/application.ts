// ================= Imports ================= //

import { Application, Command, Option } from './interfaces';
import { deepFreeze, define, matchAll } from './utilities';
import regexes from './regexes';

// =============== Application =============== //

/**
 * Application constructor
 * @returns {Application} Application object
 */
export default function application(): Application {
    // ------------ Private Properties ------------ //

    const _commands: Command[] = [];
    const _options: Option[] = [];

    // -------------- Input Parsing -------------- //

    const _parseArguments = (spec: string, providedArgs: string[]): Record<string, string> => {
        const args = {};

        const keys = matchAll(regexes.argumentParse, spec);
        if (!keys) return args;

        for (const match of keys) {
            const required = match[1].trim().replace(/[<>]/g, '').split(' ');
            const optional = match[2].replace(/[[\].]/g, '');
            const variadic = match[2].includes('...');

            required.forEach((key, index) => {
                if (!providedArgs[index]) throw new Error(`Missing argument: ${key}`);
                define(args, key, providedArgs[index]);
            });

            // required.length is passed in because
            // it's the last index of the array + 1
            // (due to arrays starting at 0)
            if (optional && providedArgs[required.length]) {
                define(
                    args,
                    optional,
                    variadic ? providedArgs.slice(required.length).join(' ') : providedArgs[required.length]
                );
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
            const optionValue = match[2].replace(/(^")|("$)/g, '');

            const optionMeta = _options.find((e) => {
                return e.name === optionKey || e.alias === optionKey;
            });

            if (optionMeta) define(options, optionKey, optionValue || optionMeta.default);
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

        if (command.arguments) {
            if (!regexes.argumentParse.test(command.arguments)) {
                throw new Error(`Arguments for command ${command.name} are formatted incorrectly`);
            }

            if (command.arguments.includes('__proto__')) {
                throw new Error(`Arguments cannot be named "__proto__"`);
            }
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

            if (option.name === '__proto__') {
                throw new Error(`Option "${option.name}" has illegal name`);
            }
        }
    };

    // -------------- Public Methods -------------- //

    /**
     * Register a command
     * @param {Command} command Command configuration
     * @returns {void} void
     */
    const command = (command: Command): void => {
        _validateCommand(command);
        _commands.push(command);
    };

    /**
     * Specify global options
     * @param {Option[]} options Command options/configuration
     * @returns {void} void
     */
    const globalOptions = (...options: Option[]): void => {
        _validateOptions(options);
        options.forEach((e) => _options.push(e));
    };

    /**
     * Parse console input & run
     * @param {string[]} [input=process.argv.splice(2)] User input
     */
    const run = (input: string[] = process.argv.splice(2)): void => {
        const command = _commands.find((c) => c.name === input[0]);
        if (!command) throw new Error('Command not found');

        const options = _parseOptions(input);
        const args = _parseArguments(command.arguments || '', input);

        command.action({ arguments: args, options: options });
    };

    // -------------- Return Object -------------- //

    return deepFreeze({
        command,
        globalOptions,
        run
    });
}
