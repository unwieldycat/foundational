// ================= Imports ================= //

import { deepFreeze, define, maxLength, matchAll, padStringTo } from './utilities';
import { Application, ApplicationSpec, Command, Option } from './types';
import regexes from './regexes';

// =============== Application =============== //

/**
 * Application constructor
 * @param spec - Application configuration
 * @returns Application object
 */
export function application(spec?: ApplicationSpec): Application {
    // ------------ Private Variables ------------ //

    const _helpOptionEnabled = !spec?.disableHelpOption;

    const _commands: Command[] = [];
    const _options: Option[] = [];

    // -------------- Input Parsing -------------- //

    const _parseArguments = (spec: string, providedArgs: string[]): Record<string, string> => {
        const args = {};

        const keys = spec.match(regexes.argumentParse);
        if (!keys) return args;

        const required = (() => {
            const s = keys[1].trim().replace(/[<>]/g, '');
            const a = (s.length > 0) ? s.split(' '): [];
            return a;
        })();

        const lastIsOptional = /[[\]]/g.test(keys[2]);
        const last = keys[2].replace(/[[\]<>.]/g, '');
        const variadic = keys[2].includes('...');

        required.forEach((key, index) => {
            if (!providedArgs[index]) throw new Error(`Missing argument: ${key}`);
            define(args, key, providedArgs[index]);
        });

        // required.length is passed in down here 
        // because it's the last index of the 
        // array + 1

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
        commandOptions: Option[]
    ): Record<string, string | boolean> => {
        const options = {};
        const stringified = exec.join(' ');
        const regexMatch = matchAll(regexes.optionParse, stringified);

        for (const match of regexMatch) {
            const optionKey = match[1];

            const optionMeta = [...(commandOptions || []), ..._options]
                .find((e) => {
                    return e.name === optionKey || e.alias === optionKey;
                });

            if (!optionMeta) continue;

            const defaultValue = optionMeta.flag ? false : optionMeta.default;
            const optionValue = optionMeta.flag || (match[2] || '').replace(/(^")|("$)/g, '');

            define(options, optionMeta.name, optionValue || defaultValue);
        }

        return options;
    };

    // ---------------- Validation ---------------- //

    const _validateCommand = (command: Command): void => {
        if (command.name.length <= 0) throw new Error('Command names must be at least 1 character');
        if (_commands.find((e) => e.name === command.name)) throw new Error(`Command ${command.name} already exists`);
        if (command.options) _validateOptions(command.options);

        if (command.arguments) {
            if (!regexes.argumentParse.test(command.arguments)) {
                throw new Error(`Arguments for command ${command.name} are formatted incorrectly`);
            }

            if (command.arguments.includes('__proto__')) throw new Error(`Arguments cannot be named "__proto__"`);
        }
    };

    const _validateOptions = (optionArray: Option[]): void => {
        for (const option of optionArray) {
            if (_options.find((e) => e.name === option.name)) {
                throw new Error(`Option ${option.name} already exists in global options`);
            }

            if (!regexes.optionValidate.test(option.name)) {
                throw new Error(`Option "${option.name}" has an incorrectly formatted name`);
            }

            if (!option.alias) continue;

            if (_options.find((e) => e.alias === option.alias)) {
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

        (command ? [command] : _commands).forEach((c: Command) => {
            commandsList.push(`${c.name} ${c.arguments || ''}`.trim());
        });

        const commandsPadLength = maxLength(commandsList) + 2;

        commandsList.forEach((s, i) => {
            const commandName = s.split(' ')[0];
            const commandMeta = _commands.find((c) => c.name === commandName);
            commandsList[i] = padStringTo(s, commandsPadLength) + (commandMeta?.description || '');
        });

        [...command?.options || [], ..._options].forEach((o: Option) => {
            optionsList.push(`${o.name} ${o.alias || ''}`.trim());
        });

        const optionsPadLength = maxLength(optionsList) + 2;

        optionsList.forEach((s, i) => {
            const optionName = s.split(' ')[0];
            const optionMeta = [...command?.options || [], ..._options].find((o) => o.name === optionName);
            optionsList[i] = padStringTo(s, optionsPadLength) + (optionMeta?.description || '');
        });

        console.log(
            `Commands:\n\n    ${commandsList.join('\n    ')}\n\nOptions:\n\n    ${optionsList.join('\n    ')}\n`
        );
    };

    if (_helpOptionEnabled) {
        _options.push({
            name: '--help',
            description: 'Display help menu.',
            flag: true
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

    const run = (input: string[] = process.argv.splice(2)): void => {
        const command = _commands.find((c) => c.name === input[0]);
        if (!command) {
            if (_helpOptionEnabled) _help();
            return;
        }

        const options = _parseOptions(input, command.options || []);

        const args = _parseArguments(
            command.arguments || '',
            // A hack to remove all options from input, due to a
            // limitation with iterating over the array instead
            (command ? input.slice(1) : input)
                .join(' ')
                .replace(regexes.optionParse, '')
                .split(' ')
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
        run
    });
}

// Re-export types for TSDoc and accessibility
export * from './types';
