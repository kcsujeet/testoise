/** biome-ignore-all lint/suspicious/noExplicitAny: any is used for type inference */
import { after, before, beforeEach, describe } from "node:test";
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
	return describe(name, () => {
		beforeEach(() => {
			activateContext();
		});

		const api: TestoiseAPI<R> = {
			def: (name, factory) => def(name as string, factory),
			get: (nameOrToken) => coreGet(nameOrToken as any),
		};

		if (fn.length > 0) {
			(fn as any)(api);
		} else {
			(fn as any)();
		}
	});
}

export function def<T>(name: string, factory: () => T): string {
	before(() => {
		pushContext();
		defineVar(name, factory);
	});

	after(() => {
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
