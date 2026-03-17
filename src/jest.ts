import { afterAll, beforeAll, beforeEach } from "@jest/globals";
import {
	activateContext,
	get as coreGet,
	defineVar,
	popContext,
	pushContext,
} from "./core.js";

export function def<T>(name: string, factory: () => T) {
	const register = defineVar(name, factory);

	beforeAll(() => {
		pushContext();
		register();
	});

	afterAll(() => {
		popContext();
	});

	beforeEach(() => {
		activateContext();
	});
}

export function get<T>(name: string): T {
	return coreGet(name);
}
