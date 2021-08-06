# beryllium
beryllium is a simple CLI app framework for node that aims to be simple, readable, and lightweight.

## Getting Started

### Installation
**npm:** `npm i beryllium`

**yarn:** `yarn add beryllium`

### Example
<!-- TODO -->
Below is an example CLI application written with beryllium. 
```typescript
// Importing (ESM)
import beryllium from 'beryllium';

// Create app
const app = beryllium();

// Declare global options
app.globalOptions(
    {
        name: '--verbose',
        alias: '-v',
        flag: true,
        description: 'Be talkative or something';
    },
    {
        name: '--yes',
        alias: '-y',
        flag: true,
        description: 'Says yes to everything'
    }
);

// Create a command
app.command({
    name: 'icecream',
    arguments: '<size> <flavor> [topping]',
    options: [
        {
            name: '--cone-type',
            alias: '-c',
            flag: false
        }
    ],
    action: (ctx) => {
        // todo
    }
});

app.run();
```