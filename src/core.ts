/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */
export type Factory<T> = () => T;

export interface Context {
	factories: Map<string, Factory<any>>;
	parent: Context | null;
}

const rootContext: Context = {
	factories: new Map(),
	parent: null,
};

// Stack maintained dynamically during test suite execution
const contextStack: Context[] = [rootContext];

// Active context during a single test (it) execution
let activeContext: Context = rootContext;

// Cache for evaluated variables during a single test execution
const runtimeCache: Map<string, any> = new Map();

// Called in `beforeAll` of each describe block
export function pushContext() {
	const parent = contextStack[contextStack.length - 1];
	if (!parent) {
		throw new Error("Context stack is empty");
	}
	const next: Context = {
		factories: new Map(),
		parent,
	};
	contextStack.push(next);
	return next;
}

// Called in `afterAll` of each describe block
export function popContext() {
	if (contextStack.length > 1) {
		contextStack.pop();
	}
}

// Called in `beforeEach` before a test executes
export function activateContext() {
	const current = contextStack[contextStack.length - 1];
	if (!current) {
		throw new Error("Context stack is empty");
	}
	activeContext = current;
	runtimeCache.clear();
}

export function defineVar<T>(name: string, factory: Factory<T>) {
	// We return a "registration" function that actually places
	// the factory into the active scope when executed.
	return () => {
		const currentContext = contextStack[contextStack.length - 1];
		if (!currentContext) {
			throw new Error("Context stack is empty");
		}
		currentContext.factories.set(name, factory);
	};
}

export function get<T>(name: string): T {
	if (runtimeCache.has(name)) {
		return runtimeCache.get(name);
	}

	let ctx: Context | null = activeContext;
	while (ctx) {
		if (ctx.factories.has(name)) {
			const factory = ctx.factories.get(name);
			if (!factory) {
				throw new Error(`Factory for "${name}" is undefined`);
			}
			const value = factory();
			runtimeCache.set(name, value);
			return value;
		}
		ctx = ctx.parent;
	}

	throw new Error(`Lazy variable "${name}" is not defined.`);
}
