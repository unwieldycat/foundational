/*
const app = application();

app.globalOptions(
    { 
        name: 'verbose',
        alias: 'v',
        description: 'Be talkative while making pizza' 
    }
)

app.command({
    name: 'getpizza',
    args: '<type> [quantity]',
    options: [
        { 
            name: 'sauce-type',
            alias: 's',
            description: 'Add specified sauce to your pizza' 
        },
        {
            name: 'add-cheese',
            alias: 'a',
            description: 'Add cheese to your pizza'
        }
    ],
    action: (ctx) => {
        
    }
})

app.run();
*/

export * from './application';
