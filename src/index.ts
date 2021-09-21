// ================= Imports ================= //

import { deepFreeze, define, maxLength, matchAll, padStringTo, removeFromArray } from './utilities';
import { Application, ApplicationSpec, Command, Flag, Option } from './types';
import regexes from './regexes';

// =============== Application =============== //

/**
 * Application constructor
 * @param spec Application configuration
 * @returns Application object
 */
export function application(spec?: ApplicationSpec): Application {
    // ------------ Private Variables ------------ //

    const _helpOptionEnabled = !spec?.disableHelpOption;

    const _commands: Command[] = [];
    const _options: Option[] = [];
    const _flags: Flag[] = [];

    // -------------- Input Parsing -------------- //

    const _parseArguments = (spec: string, providedArgs: string[]): Record<string, string> => {
        const args = {};

        const keys = spec.match(regexes.argumentParse);
        if (!keys) return args;

        const required = keys[1].trim().replace(/[<>]/g, '').split(' ');
        const lastIsOptional = keys[2].match(/[[\]]/g);
        const last = keys[2].replace(/[[\]<>.]/g, '');
        const variadic = keys[2].includes('...');

        required.forEach((key, index) => {
            if (!providedArgs[index]) throw new Error(`Missing argument: ${key}`);
            define(args, key, providedArgs[index]);
        });

        // required.length is passed in because
        // it's the last index of the array + 1
        // (due to arrays starting at 0)

        if (last) {
            if (providedArgs[required.length]) {
                define(
                    args,
                    last,
                    variadic ? providedArgs.slice(required.length).join(' ') : providedArgs[required.length]
                );
            } else if (!lastIsOptional) {
                throw new Error(`Missing argument: ${last}`);
            }
        }

        return args;
    };

    const _parseOptions = (
        exec: string[],
        commandOptions: { flags?: Flag[]; options?: Option[] }
    ): Record<string, string | boolean> => {
        const options = {};
        const stringified = exec.join(' ');
        const regexMatch = matchAll(regexes.optionParse, stringified);

        for (const match of regexMatch) {
            const optionKey = match[1];

            const optionMeta = [
                ...(commandOptions.flags || []),
                ...(commandOptions.options || []),
                ..._options,
                ..._flags
            ].find((e) => {
                return e.name === optionKey || e.alias === optionKey;
            });

            if (!optionMeta) continue;
            const isFlag = commandOptions.flags?.includes(optionMeta);

            /* @ts-ignore - tsc is stupid */
            const defaultValue = isFlag ? false : optionMeta.default;
            const optionValue = isFlag || (match[2] || '').replace(/(^")|("$)/g, '');

            define(options, optionMeta.name, optionValue || defaultValue);
        }

        return options;
    };

    // ---------------- Validation ---------------- //

    const _validateCommand = (command: Command): void => {
        if (command.name.length <= 0) throw new Error('Command names must be at least 1 character');
        if (_commands.find((e) => e.name === command.name)) throw new Error(`Command ${command.name} already exists`);
        if (command.options) _validateOptions(command.options);
        if (command.flags) _validateOptions(command.flags);

        if (command.arguments) {
            if (!regexes.argumentParse.test(command.arguments)) {
                throw new Error(`Arguments for command ${command.name} are formatted incorrectly`);
            }

            if (command.arguments.includes('__proto__')) throw new Error(`Arguments cannot be named "__proto__"`);
        }
    };

    const _validateOptions = (optionArray: Option[] | Flag[]): void => {
        for (const option of optionArray) {
            if (_options.find((e) => e.name === option.name) || _flags.find((e) => e.name === option.name)) {
                throw new Error(`Option ${option.name} already exists in global options`);
            }

            if (!regexes.optionValidate.test(option.name)) {
                throw new Error(`Option "${option.name}" has an incorrectly formatted name`);
            }

            if (!option.alias) continue;

            if (_options.find((e) => e.alias === option.alias) || _flags.find((e) => e.alias === option.alias)) {
                throw new Error(
                    `Option ${option.name} already exists in global options, or it's alias is already in use`
                );
            }

            if (!regexes.aliasValidate.test(option.alias)) {
                throw new Error(`Alias "${option.alias}" for option ${option.name} is formatted incorrectly`);
            }

            if (option.name === '__proto__') {
                throw new Error(`Option "${option.name}" has illegal name`);
            }
        }
    };

    // --------------- Help Option --------------- //

    const _help = (command?: Command) => {
        const commandsList: string[] = [];
        const optionsList: string[] = [];
        const commandOptions = [...(command?.options || []), ...(command?.flags || [])];

        (command ? [command] : _commands).forEach((c: Command) => {
            commandsList.push(`${c.name} ${c.arguments || ''}`.trim());
        });

        const commandsPadLength = maxLength(commandsList) + 2;

        commandsList.forEach((s, i) => {
            const commandName = s.split(' ')[0];
            const commandMeta = _commands.find((c) => c.name === commandName);
            commandsList[i] = padStringTo(s, commandsPadLength) + (commandMeta?.description || '');
        });

        [...commandOptions, ..._options, ..._flags].forEach((o: Option | Flag) => {
            optionsList.push(`${o.name} ${o.alias || ''}`.trim());
        });

        const optionsPadLength = maxLength(optionsList) + 2;

        optionsList.forEach((s, i) => {
            const optionName = s.split(' ')[0];
            const optionMeta = [...commandOptions, ..._options, ..._flags].find((o) => o.name === optionName);
            optionsList[i] = padStringTo(s, optionsPadLength) + (optionMeta?.description || '');
        });

        console.log(
            `Commands:\n\n    ${commandsList.join('\n    ')}\n\nOptions:\n\n    ${optionsList.join('\n    ')}\n`
        );
    };

    if (_helpOptionEnabled) {
        _flags.push({
            name: '--help',
            description: 'Display help menu.'
        });
    }

    // ------------- Public Functions ------------- //

    const command = (command: Command): void => {
        _validateCommand(command);
        _commands.push(command);
    };

    const commands = (...commands: Command[]): void => {
        commands.forEach((c) => {
            command(c);
        });
    };

    const globalOptions = (...options: Option[]): void => {
        _validateOptions(options);
        options.forEach((e) => _options.push(e));
    };

    const globalFlags = (...flags: Flag[]): void => {
        _validateOptions(flags);
        flags.forEach((e) => _flags.push(e));
    };

    const run = (input: string[] = process.argv.splice(2)): void => {
        const command = _commands.find((c) => c.name === input[0]);
        if (!command) {
            if (_helpOptionEnabled) _help();
            return;
        }

        const options = _parseOptions(input, {
            options: command.options,
            flags: command.flags
        });

        const args = _parseArguments(
            command.arguments || '',
            removeFromArray(command ? input.slice(1) : input, regexes.optionParse)
        );

        if (options['--help'] && _helpOptionEnabled) {
            _help(command);
            process.exit(0);
        }

        command.action({ arguments: args, options: options });
    };

    // -------------- Return Object -------------- //

    return deepFreeze({
        command,
        commands,
        globalOptions,
        globalFlags,
        run
    });
}
