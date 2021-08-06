// ================= Imports ================= //

import { Application, ApplicationSpec, Command, Option } from './interfaces';
import { deepFreeze, define, maxLength, matchAll, padStringTo, removeFromArray } from './utilities';
import regexes from './regexes';

// =============== Application =============== //

/**
 * Application constructor
 * @returns {Application} Application object
 */
export default function application(spec: ApplicationSpec): Application {
    // ------------ Private Properties ------------ //

    const _appName = spec.name;
    const _helpOptionEnabled = spec.helpOption;

    const _commands: Command[] = [];
    const _options: Option[] = [];

    // -------------- Input Parsing -------------- //

    const _parseArguments = (spec: string, providedArgs: string[]): Record<string, string> => {
        const args = {};

        // matchAll() doesnt work here for some reason
        const keys = spec.match(regexes.argumentParse);
        if (!keys) return args;

        const required = keys[1].trim().replace(/[<>]/g, '').split(' ');
        const optional = keys[2].replace(/[[\].]/g, '');
        const variadic = keys[2].includes('...');

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

        return args;
    };

    const _parseOptions = (exec: string[], command?: Command): Record<string, string | boolean> => {
        const options = {};
        const stringified = exec.join(' ');
        const regexMatch = matchAll(regexes.optionParse, stringified);

        for (const match of regexMatch) {
            const optionKey = match[1];

            // this is terrible but it works
            const optionMeta = [...(command?.options || []), ..._options].find((e) => {
                return e.name === optionKey || e.alias === optionKey;
            });

            if (!optionMeta) continue;

            const optionValue = optionMeta.flag || (match[2] || '').replace(/(^")|("$)/g, '');

            if (!optionValue) {
                console.log('Options cannot have empty value');
                process.exit(0);
            }

            if (optionMeta) define(options, optionMeta.name, optionValue || optionMeta.default);
        }

        return options;
    };

    // ---------------- Validation ---------------- //

    const _validateCommand = (command: Command): void => {
        if (command.name.length === 0 && !command.default) {
            throw new Error('Command names must have at least 1 character if not set to default');
        }

        if (command.default && _commands.find((c) => c.default)) {
            throw new Error('There may only be one default command');
        }

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

    // --------------- Help Option --------------- //

    const _help = (command?: Command) => {
        const commandsList: string[] = [];
        const optionsList: string[] = [];

        (command ? [command] : _commands).forEach((c: Command) => {
            commandsList.push(`${_appName} ${c.name} ${c.arguments}`.trim());
        });

        const commandsPadLength = maxLength(optionsList) + 4;

        commandsList.forEach((s, i) => {
            const commandName = s.split(' ')[0];
            const commandMeta = _commands.find((c) => c.name === commandName);
            commandsList[i] = padStringTo(s, commandsPadLength) + (commandMeta?.description || '');
        });

        (command?.options ? [...command.options, ..._options] : _options).forEach((o: Option) => {
            optionsList.push(`${o.name} ${o.alias}`);
        });

        const optionsPadLength = maxLength(optionsList) + 4;

        optionsList.forEach((s, i) => {
            const optionName = s.split(' ')[0];
            const optionMeta = _options.find((o) => o.name === optionName);
            optionsList[i] = padStringTo(s, optionsPadLength) + (optionMeta?.description || '');
        });

        console.log('Usage:\n\n' + commandsList.join('\n') + '\n\nOptions:\n\n' + optionsList.join('\n') + '\n');
    };

    if (_helpOptionEnabled) {
        _options.push({
            name: '--help',
            flag: true,
            description: 'Display help menu.'
        });
    }

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
        const command = _commands.find((c) => c.name === input[0]) || _commands.find((c) => c.default);
        if (!command) return _help();

        const options = _parseOptions(input, command);
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
        globalOptions,
        run
    });
}
