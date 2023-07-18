import { Application } from "../mod.ts";

const app = new Application();

app.use((_, next) => {
	console.log("Hello");
	next();
	console.log("Goodbye");
});

app.command({
	name: "command1",
	action: () => {
		console.log("Ran command 1");
	},
});

app.command({
	name: "command2",
	action: () => {
		console.log("Ran command 2");
	},
});

app.run();
