// ================================ Imports ================================ //

import { Group, GroupSpec, IGroup } from "./group.ts";
import { ActionContext, NextFunction } from "./types.ts";

// ================================= Types ================================= //

export interface IApplication extends IGroup {
	run: (input?: string[]) => void;
}

export interface ApplicationSpec extends GroupSpec {
	version?: string;
}

// =========================== Application Class =========================== //

export class Application extends Group implements IApplication {
	protected _version?: string;

	// -------------------------- Private Methods -------------------------- //

	private _version_middleware(ctx: ActionContext, next: NextFunction) {
		if (ctx.flags.version && this?._version) console.log(this._version);
		else next();
	}

	// ---------------------------- Constructor ---------------------------- //

	/**
	 * Application constructor
	 * @param spec - Application configuration
	 * @returns Application object
	 */
	constructor(spec: ApplicationSpec) {
		super(spec);
		this._version = spec.version;

		this.use(this._version_middleware);

		this._options.push({
			name: "--help",
			alias: "-h",
			description: "Show the help menu",
			flag: true,
		});

		if (this._version) {
			this._options.push({
				name: "--version",
				alias: "-v",
				description: "Show the version",
				flag: true,
			});
		}
	}

	// --------------------------- Public Methods --------------------------- //

	/**
	 * Parse console input & run
	 * @param input - User input
	 * @returns void
	 */
	run(input: string[] = Deno.args) {
		this._run(input);
	}
}
