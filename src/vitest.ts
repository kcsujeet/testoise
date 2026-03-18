/** biome-ignore-all lint/suspicious/noExplicitAny: any is used for type inference */
import { afterAll, beforeAll, beforeEach, describe } from "vitest";
import {
	activateContext,
	get as coreGet,
	defineVar,
	popContext,
	pushContext,
	type Registry,
	type TestoiseAPI,
} from "./core.js";

/**
 * A suite wrapper that provides a typed API for lazy variables.
 */
export function testoise<R extends Registry>(
	name: string,
	fn: (api: TestoiseAPI<R>) => void,
) {
	return describe(name, (suite) => {
		const defs: Array<[string | number | symbol, () => any]> = [];

		beforeAll(() => {
			pushContext(suite);
			for (const [n, f] of defs) {
				defineVar(n as string, f);
			}
		});

		afterAll(() => {
			popContext(suite);
		});

		beforeEach(() => {
			activateContext();
		});

		const api: TestoiseAPI<R> = {
			def: (name, factory) => {
				defs.push([name, factory]);
			},
			get: (nameOrToken) => coreGet(nameOrToken as any),
			testoise: (subName, subFn) => testoise<R>(subName, subFn),
		};

		fn(api);
	});
}

export function def<T>(name: string, factory: () => T): string {
	beforeAll((suite) => {
		pushContext(suite);
		defineVar(name, factory);
	});

	afterAll((suite) => {
		popContext(suite);
	});

	beforeEach(() => {
		activateContext();
	});

	return name;
}

export function get<T = any>(name: string): T {
	return coreGet<T>(name);
}
