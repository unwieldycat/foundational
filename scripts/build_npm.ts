import { build, emptyDir } from "dnt";

await emptyDir("./npm");

await build({
	entryPoints: ["./mod.ts"],
	outDir: "./npm",
	shims: {
		// see JS docs for overview and more options
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
