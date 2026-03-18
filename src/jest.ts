/** biome-ignore-all lint/suspicious/noExplicitAny: any is used for type inference */
import { afterAll, beforeAll, beforeEach, describe } from "@jest/globals";
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
	const suiteId = Symbol(name);
	return describe(name, () => {
		const defs: Array<[string | number | symbol, () => any]> = [];

		beforeAll(() => {
			pushContext(suiteId);
			for (const [n, f] of defs) {
				defineVar(n as string, f);
			}
		});

		afterAll(() => {
			popContext(suiteId);
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
	beforeAll(() => {
		pushContext();
		defineVar(name, factory);
	});

	afterAll(() => {
		popContext();
	});

	beforeEach(() => {
		activateContext();
	});

	return name;
}

export function get<T = any>(name: string): T {
	return coreGet<T>(name);
}
