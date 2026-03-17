import { afterAll, beforeAll, beforeEach } from "bun:test";
import {
	activateContext,
	get as coreGet,
	defineVar,
	popContext,
	pushContext,
} from "./core.js";

export function def<T>(name: string, factory: () => T) {
	// 1. define the variable immediately in the current synchronous context representation
	const register = defineVar(name, factory);

	// Let's do simple registration:
	beforeAll(() => {
		// We register the factory AFTER pushing context for the current suite grouping.
		// wait, we need one push per suite...
		// If we call pushContext here, it pushes one context per variable.
				// Is that what we want? Yes.
		// It uses singletons per suite, so the simplest pattern is:
		// 1 context push/pop per variable!
		// It works exactly like a scope chain!
		pushContext();
		register();
	});

	afterAll(() => {
		popContext();
	});

	// `beforeEach` runs sequentially before tests
	beforeEach(() => {
		activateContext();
	});
}

export function get<T>(name: string): T {
	return coreGet(name);
}
