import { build, emptyDir } from "dnt";

await emptyDir("./dist");

const version = Deno.args.at(0);
if (!version) {
	throw new Error("Please supply version");
}

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
		deno: "dev",
		custom: [
			{
				module: "scripts/shims/args.ts",
				globalNames: ["Deno"],
			},
		],
	},
	package: {
		name: "foundational",
		version: version,
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
