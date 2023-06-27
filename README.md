# foundational

Foundational is a simple multi-command CLI app framework for Deno and Node that aims to be ultra-simple, readable, and lightweight.

## Installing

### Deno
Include and cache
 `https://deno.land/x/foundational@v2.0.0/mod.ts`

> 💡 **Tip:** For simpler dependency managment, [use an import map instead of a deps.ts file](https://deno.com/manual@v1.34.3/basics/import_maps)


### Node
Install via the npm registry

**npm:** `npm install foundational`

**yarn:** `yarn add foundational`

## Example

The following is an example application written with foundational:

```javascript
const { application } = require('foundational');
const app = application({ version: '1.0.0' });

app.options({
	name: '--resolution',
	description: 'Specify a resolution for the image (format: 1920x1080, 1024x768, etc.)',
	alias: '-r'
});

app.command({
	name: 'dog-picture',
	description: 'Fetch a picture of a dog',
	options: [
		{
			name: '--puppy',
			description: 'Find a picture of a puppy',
			alias: '-p',
			flag: true
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
	options: [
		{
			name: '--kitten',
			description: 'Find a picture of a kitten',
			alias: '-k',
			flag: true
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

## Application Object

The `application()` constructor function returns the application object. The application object exposes the functions necessary to build a CLI application.

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

### Creating an Option

To create an option, specify it in the command object or globally with `Application.options()`. The names and aliases must be formatted as if it were being used in the CLI.

**Specifying a global option & flag**

```javascript
const app = application();

app.options(
	{
		name: '--cool-option',
		alias: '-c',
		description: 'A very cool global option'
	},
	{
		name: '--cool-flag',
		alias: '-f',
		description: 'A very cool global flag',
		flag: true
	}
);
```

**Specifying a command option & flag**

```javascript
const app = application();

app.command({
	name: 'example',
	options: [
		{
			name: '--cool-option',
			alias: '-c',
			description: 'A very cool command option'
		},
		{
			name: '--cool-flag',
			alias: '-f',
			description: 'A very cool command flag',
			flag: true
		}
	],
	action: (ctx) => {
		// ...
	}
});
```

### Naming

Option names may include dashes and dots in their name, however, they must include at least one letter prior. The following are both examples of valid option names: `--example.with.dots`, `--example-with-dashes`

Aliases may only include 1 or 2 letters.
