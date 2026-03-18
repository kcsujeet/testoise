/** biome-ignore-all lint/suspicious/noExplicitAny: false positive */
type Factory<T> = () => T;

export type Registry = Record<string, any>;

/**
 * Registry-aware variable name type.
 */
export type VarName<R extends Registry> = keyof R extends never
	? string
	: keyof R | (string & {});

/**
 * Registry-aware variable type inference.
 */
export type InferVarType<
	K extends string | number | symbol,
	R extends Registry,
	Dauphine extends Registry = any,
> = K extends keyof R ? R[K] : K extends keyof Dauphine ? Dauphine[K] : any;

interface Context {
	factories: Map<string, Factory<any>>;
	parent: Context | null;
	suiteId?: any; // Used to deduplicate context pushes in some frameworks
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

/**
 * Pushes a new context. If a suiteId is provided, it will first check if the
 * current top context already belongs to that suite.
 */
export function pushContext(suiteId?: any) {
	const parent = contextStack[contextStack.length - 1];
	if (!parent) {
		throw new Error("Context stack is empty");
	}

	if (suiteId && parent.suiteId === suiteId) {
		return parent;
	}

	const next: Context = {
		factories: new Map(),
		parent,
		suiteId,
	};
	contextStack.push(next);
	return next;
}

// Called in `afterAll` of each describe block
export function popContext(suiteId?: any) {
	const current = contextStack[contextStack.length - 1];
	if (contextStack.length > 1 && (!suiteId || current?.suiteId === suiteId)) {
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

/**
 * Internal logic for defining a variable.
 */
export function defineVar<T>(name: string, factory: Factory<T>): string {
	const currentContext = contextStack[contextStack.length - 1];
	if (!currentContext) {
		throw new Error("Context stack is empty");
	}

	// Runtime Strictness: Check for redefinition in the same scope
	if (currentContext.factories.has(name)) {
		throw new Error(
			`Lazy variable "${name}" is already defined in this scope. Use deep nesting to override variables.`,
		);
	}

	currentContext.factories.set(name, factory);
	return name;
}

export interface TestoiseAPI<R extends Registry> {
	/** Define a lazy variable within this suite's registry */
	def: <K extends VarName<R>>(
		name: K,
		factory: () => InferVarType<K, R>,
	) => void;
	/** Get a lazy variable's value with automatic type inference */
	get: <K extends VarName<R>>(name: K) => InferVarType<K, R>;
}

/**
 * Returns the value of a lazy variable.
 * Use the testoise() wrapper for automatic type inference,
 * or provide a generic for manual casting: get<string>("name").
 */
export function get<T = any>(name: string): T {
	if (runtimeCache.has(name)) {
		return runtimeCache.get(name) as T;
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
			return value as T;
		}
		ctx = ctx.parent;
	}

	throw new Error(`Lazy variable "${name}" is not defined.`);
}
