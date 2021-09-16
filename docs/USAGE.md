# Usage
Documentation on how to use foundational.

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
The `application()` constructor function returns the application object. The application object exposes a few functions to add commands and options.

<!-- WIP -->

## Options
<!-- WIP -->

## API Reference
<!-- WIP -->