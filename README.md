# foundational <br> [![licence](https://img.shields.io/badge/Licence-MIT-green)](./LICENCE) [![npm package](https://img.shields.io/npm/v/foundational?color=red)](https://npmjs.com/foundational) [![deno module](https://shield.deno.dev/x/foundational)](https://deno.land/x/foundational)

Foundational is a multi-command CLI library for Deno and Node that aims to be simple, readable, and lightweight.

## Installing

### Deno
Include and cache
 `https://deno.land/x/foundational@v2.0.0/mod.ts`

> 💡 **Tip:** For simpler dependency managment, [use an import map instead of a deps.ts file](https://deno.com/manual@v1.34.3/basics/import_maps)


### Node
Install via the npm registry

**npm:** `npm install foundational`

**yarn:** `yarn add foundational`

<!-- TODO: ----------------------->
<!-- TODO: Update readme for v3 -->
<!-- TODO: ----------------------->

## Commands

Commands may be declared one at a time with the `Application.command()` function, or all at once with the `Application.commands()` function.

### Arguments

Command arguments are one way for users to provide input specific to a command. Command arguments in foundational must be specified in a string inside of the command object.

Arguments must be declared in a string like so:

```
<argument1> <argument2> [argument3...]
```

Argument names wrapped in pointy brackets are required, whereas square bracketed argument names make an argument optional. Additionally, adding three dots in the end of the last argument makes it variadic. Only the last argument may be variadic and/or optional.

## Options & Flags

Options are ways a user can provide additional optional input to alter the behavior of a CLI app. Options have a specified value, whereas a flag has a boolean value.

Options can be written in various ways. For example, the following are all valid ways for a user to specify an option: `--option="Option Value"`, `--option value`, `-o=value`, `-o value`, etc.

Flags are written without a specified value like so: `--flag` (or `-f` if the alias exists)

### Naming

Option names may include dashes and dots in their name, and they may have uppercase and lowercase characters. The following are examples of valid option names: `--example.with.dots`, `--example-with-dashes`, `--exampleWithCamels`, `--exAmpLe.fRoM-HELL`

Aliases may only include 1 or 2 letters.
