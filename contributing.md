# Contributing

The following document will describe how to contribute, and what guidelines must be followed.

## Environment Setup
- Make sure [Deno](https://deno.land/) is installed on your system. Node and npm isn't required.

- Cache the dev dependencies specified in the `deno.json` file

### vscode
Install the Deno extension and set the following options in the workspace settings:

```jsonc
{
	"deno.enable": true,
	"deno.config": "./deno.json",
	"editor.defaultFormatter": "denoland.vscode-deno",
    
    // In some cases this is needed
	"[typescript]": {
    	"editor.defaultFormatter": "denoland.vscode-deno"
  	}
}
```


## Issues

**Before creating an issue, check to see if a similar issue has already been submitted.** If a duplicate issue is created then it will be marked as duplicate and closed. When creating an issue, thoroughly describe the problem or idea being presented for clarity.

Issue templates may be found when creating an issue. If you have any questions then feel free to submit a question issue!

## Pull Requests

A pull request template can be found upon making a PR. When creating a pull request, make sure to describe and justify the entire issue or feature change. 
