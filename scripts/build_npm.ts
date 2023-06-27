import { build, emptyDir } from "dnt";

await emptyDir("./dist");

await build({
	entryPoints: ["./mod.ts"],
	outDir: "./dist",
	typeCheck: "both",
	scriptModule: false,
	test: false,
	compilerOptions: {
		target: "ES2022",
		noImplicitAny: true,
		lib: ["ES2022"]
	},
	shims: {
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
		Deno.copyFileSync("LICENSE", "npm/LICENSE");
		Deno.copyFileSync("README.md", "npm/README.md");
	},
});
