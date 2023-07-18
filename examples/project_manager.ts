import { Application, Group } from "../mod.ts";

const app = new Application({ description: "Project manager example" });
const group = new Group({ description: "Plugin manager" });

app.command({
	name: "build",
	description: "Build project",
	action: () => {
		console.log("Built project");
	},
});

app.command({
	name: "run",
	description: "Run project",
	action: () => {
		console.log("Running project");
	},
});

group.command({
	name: "install",
	arguments: "<name>",
	description: "Install a plugin",
	action: (ctx) => {
		console.log(`Installing plugin "${ctx.arguments.name}"`);
	},
});

group.command({
	name: "remove",
	arguments: "<name>",
	description: "Uninstall a plugin",
	action: (ctx) => {
		console.log(`Removing plugin "${ctx.arguments.name}"`);
	},
});

app.group("plugin", group);

app.run();
