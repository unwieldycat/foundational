# foundational
Foundational is a simple CLI app framework for Node that aims to be ultra-simple, readable, and lightweight.

## Installing
To use foundational, simply install it via npm (recommended) or build it from source. Be sure to install it as a production dependency if you're using npm.

### Building (Optional)
1. Clone the respository
2. Navigate to the project directory
3. Install the dependencies with `npm install` 
4. Run `npm run build` to build the project

The production files will then be available in the `dist` folder.

## Example
The following is an example application written with foundational:

```javascript
const { application } = require('foundational');
const app = application();

app.globalOptions(
    {
        name: '--resolution',
        description: 'Specify a resolution for the image (format: 1920x1080, 1024x768, etc.)',
        alias: '-r'
    }
)

app.command({
    name: 'dog-picture',
    description: 'Fetch a picture of a dog',
    flags: [
        {
            name: '--puppy',
            description: 'Find a picture of a puppy',
            alias: '-p'
        }
    ],
    action: (ctx) => {
        const puppy = ctx.options['--puppy'];
        const resolution = ctx.options['--resolution'] || 'featured';
        console.log(`https://source.unsplash.com/${resolution}/?${puppy ? 'puppy' : 'dog'}`);
    }
});

app.command({
    name: 'cat-picture',
    description: 'Fetch a picture of a cat',
    flags: [
        {
            name: '--kitten',
            description: 'Find a picture of a kitten',
            alias: '-k'
        }
    ],
    action: (ctx) => {
        const kitten = ctx.options['--kitten'];
        const resolution = ctx.options['--resolution'] || 'featured';
        console.log(`https://source.unsplash.com/${resolution}/?${kitten ? 'kitten' : 'cat'}`);
    }
});

app.run();
```
<!-- WIP -->

## Application Object
The `application()` constructor function returns the application object. The application object exposes the functions necessary to build a CLI application.

<!-- WIP -->

## Commands
Commands may be declared one at a time with the `Application.command()` function, or all at once with the `Application.commands()` function.

### Arguments
Command arguments are one way for users to provide input specific to a command. Command arguments in foundational must be specified in a string inside of the command object. 

Arguments must be declared in a string like so:
```
<argument1> <argument2> [argument3...]
```

Argument names wrapped in pointy brackets are required, whereas square bracketed argument names make an argument optional. Additionally, adding three dots in the end of the last argument makes it variadic.

## Options & Flags
Options are ways a user can provide additional optional input to alter the behavior of a CLI app. Options have a specified value, whereas a flag has a boolean value. 

In runtime, options can be written in various ways. For example, the following are all valid ways for a user to specify an option: `--option="Option Value"`, `--option value`, `-o=value`, `-o value`, etc.


Flags, on the other hand, are written without a specified value, like so: `--flag` (or `-f` if the alias exists)

### Creating an Option
To create an option, specify it in the command object or in the `Application.globalOptions()` function. The names and aliases must be formatted as if it were being used in the CLI.

**Specifying a global option & flag**

```javascript
// Assuming app is the result of application()

app.globalOptions(
    {
        name: '--cool-option',
        alias: '-c',
        description: 'A very cool global option'
    }
);

app.globalFlags(
    {
        name: '--cool-flag',
        alias: '-f',
        description: 'A very cool global flag'
    }
)
```

**Specifying a command option & flag**

```javascript
// Assuming app is the result of application()

app.command({
    name: 'example',
    options: [
        {
            name: '--cool-option',
            alias: '-c',
            description: 'A very cool command option'
        }
    ],
    flags: [
        {
            name: '--cool-flag',
            alias: '-f',
            description: 'A very cool global flag'
        }
    ],
    action: (ctx) => {
        // ...
    }
})
```