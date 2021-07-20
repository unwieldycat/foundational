// ================= Imports ================= //

import { Application, Command, Option } from './interfaces';
import { deepFreeze } from './utilities';

// =============== Application =============== //

export default function application(): Application {
    /** @access private */
    const _commands: Command[] = [];

    /** @access private */
    const _options: Option[] = [];

    /**
     * Register a command
     * @param command Command configuration
     * @returns Command object
     */
    const command = (command: Command): void => {
        // check command is valid
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
     * @access private
     * @param input
     */
    const _parseOptions = (input: string[]): Record<string, string> => {
        const options = {};

        for (const arg of input) {
            // im proud of this mean ass regex
            const regexMatch = arg.match(/^(--?[\w-]*)([= ]?)((?:\w* *|".*"?))$/gm);
            if (!regexMatch || regexMatch.length <= 0) continue;

            const optionKey = regexMatch[1];
            const optionValue = regexMatch[2];

            const optionMeta = _options.find((e) => {
                return e.name === optionKey || e.alias?.includes(optionKey);
            });

            Object.defineProperty(options, optionKey, {
                value: (optionMeta?.type === 'boolean') ? true : optionValue
            });
        }

        return options;
    };

    /**
     * @access private
     */
    const _validateOptions = (optionArray: Option[]): void => {
        for (const option of optionArray) {
            if (!/^--(\w*)$/.test(option.name)) {
                throw new Error(
                    `Option "${option.name}" has an incorrectly formatted name`
                );
            }

            if (!option.alias) continue;
            for (const alias of option.alias) {
                if (!/^-(\w)$/.test(alias)) {
                    throw new Error(
                        `Alias "${alias}" for option ${option.name} is formatted incorrectly`
                    );
                }
            }
        }
    };

    /**
     * Parse console input & run
     * @param input
     */
    const run = (input: string[] = process.argv): void => {
        const options = _parseOptions(input);
        console.log(options);
    };

    return deepFreeze({
        _options,
        _commands,
        _parseOptions,
        command,
        globalOptions,
        run
    });
}

// @ts-ignore
application()._parseOptions();
