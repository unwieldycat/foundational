import { build, emptyDir } from "dnt";

await emptyDir("./dist");

await build({
	entryPoints: ["./mod.ts"],
	outDir: "./dist",
	typeCheck: "both",
	scriptModule: "cjs",
	test: false,
	compilerOptions: {
		target: "ES2022",
		noImplicitAny: true,
		lib: ["ES2022"],
	},
	shims: {
		// TODO: DIY shims to reduce package size
		deno: true,
	},
	package: {
		name: "foundational",
		version: "1.0.0",
		description: "A simple CLI framework.",
		keywords: [
			"cli",
		],
		author: "unwieldycat",
		license: "MIT",
		repository: {
			type: "git",
			url: "git+https://github.com/unwieldycat/foundational.git",
		},
	},
	postBuild() {
		Deno.copyFileSync("LICENCE", "dist/LICENCE");
		Deno.copyFileSync("README.md", "dist/README.md");

		// Add node modules to npmignore
		const contents = Deno.readTextFileSync("dist/.npmignore");
		Deno.writeTextFileSync("dist/.npmignore", contents + "node_modules/\n");
	},
});
