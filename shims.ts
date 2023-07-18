// deno-lint-ignore-file
// @ts-nocheck

export const Deno = {
	args: process.argv.slice(2),
	exit: (code?: int) => process.exit(code),
};
