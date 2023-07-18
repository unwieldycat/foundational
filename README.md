# foundational <br> [![licence](https://img.shields.io/badge/Licence-MIT-green)](./LICENCE) [![npm package](https://img.shields.io/npm/v/foundational?color=red)](https://npmjs.com/foundational) [![deno module](https://shield.deno.dev/x/foundational)](https://deno.land/x/foundational)

Foundational is a multi-command CLI library for Deno and Node that aims to be simple, readable, and lightweight.

## Installing

### Deno
Import and cache
 `https://deno.land/x/foundational@v3.0.0/mod.ts`

> 💡 **Tip:** For simpler dependency managment, [use an import map instead of a deps.ts file](https://deno.com/manual@v1.34.3/basics/import_maps)


### Node
Install via the npm registry

**npm:** `npm install foundational`

**yarn:** `yarn add foundational`

## Commands

In a multi-functional CLI app, commands are the way the user interfaces with your app. The base command to your application, say `npm` for example, serves no function but to provide a gateway to sub-commands that the user can interface with, like `npm install`. The base command will also provide a directory of commands if the user has not specified a valid command.

A command may be declared with the `Application#command()` method, and multiple commands may be declared with `Application#commands()`

### Arguments

Command arguments are how users can provide contextual input to a command, such as a download URL or a path to a file to be modified. Command arguments are specified as a string when declaring a command in the following syntax:


```
<argument1> <argument2> [argument3...]
```

Argument names wrapped in pointy brackets are required,  square bracketed arguments are optional, and adding three dots in the end of the last argument makes it variadic. Only the last argument may be variadic and/or optional.

## Command Groups

Command groups are a way to group similar commands together. Let's say we have a few commands, `app install-plugin`, `app remove-plugin` and `app list-plugin`. These commands can be put in their own "plugin" group and be written as such: `app plugin install`, `app plugin remove`, `app plugin list`. We can also declare options that apply to the entire group.

Commands can be added to a command group the same way they would be added to the application, and can be declared like so:
```typescript
const app = new Application();
const group = new Group();

// Commands would be declared

app.group("group-name", group);
app.run();

```


## Options & Flags

Options are how a user can provide additional optional input to alter the behavior of a command. Options have a specified value, whereas a flag has a boolean value. Flags are specified as option with property `flag` set to true, though they are seperate from options in ActionContext and live under the `flags` property.

Options can be written in various ways. For example, the following are all valid ways for a user to specify an option: `--option="Option Value"`, `--option value`, `-o=value`, `-o value`, etc.

Flags are written without a specified value like so: `--flag` (or `-f` if the alias exists)

### Naming

Option names may include dashes and dots in their name, and they may have uppercase and lowercase characters. The following are examples of valid option names: `--example.with.dots`, `--example-with-dashes`, `--exampleWithCamels`, `--exAmpLe.fRoM-HELL`

Aliases may only include 1 or 2 letters.

### Global options

Options can be declared globally when specified in the Application constructor. 

Command groups will inherit the global options of their parent, and can have their own global options for their scope if defined in their constructor.

## Middleware
Middleware functions are a set of user-defined functions that are run before the command, with all the information that the command recieves. 

### Defining
To define a middleware function, call the `use()` method on a command group or application. The function should take two arguments of type ActionContext and NextFunction respectively. The next function can be called to run the next middleware function or command action.

```typescript
app.use((ctx, next) => {
    next();
})
```
