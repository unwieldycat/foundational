export function error(message: string): void {
	console.error(`\x1b[1m\x1b[31merror\x1b[0m: ${message}`);
	Deno.exit();
}
