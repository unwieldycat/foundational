import { application } from "../mod.ts";
const app = application({ version: "1.0.0" });

app.options({
	name: "--resolution",
	description: "Specify a resolution for the image (format: 1920x1080, 1024x768, etc.)",
	alias: "-r",
});

app.command({
	name: "dog-picture",
	description: "Fetch a picture of a dog",
	options: [
		{
			name: "--puppy",
			description: "Find a picture of a puppy",
			alias: "-p",
			flag: true,
		},
	],
	action: (ctx) => {
		const puppy = ctx.options["--puppy"];
		const resolution = ctx.options["--resolution"] || "featured";
		console.log(`https://source.unsplash.com/${resolution}/?${puppy ? "puppy" : "dog"}`);
	},
});

app.command({
	name: "cat-picture",
	description: "Fetch a picture of a cat",
	options: [
		{
			name: "--kitten",
			description: "Find a picture of a kitten",
			alias: "-k",
			flag: true,
		},
	],
	action: (ctx) => {
		const kitten = ctx.options["--kitten"];
		const resolution = ctx.options["--resolution"] || "featured";
		console.log(`https://source.unsplash.com/${resolution}/?${kitten ? "kitten" : "cat"}`);
	},
});

app.run();
