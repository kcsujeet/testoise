<div align="center">
  <h1>🐢 testoise</h1>
  <p><strong>RSpec-style lazy test variables for modern JS (Bun, Vitest, Jest). <br/> Effortless, scoped, and reactive setups for your test suites.</strong></p>

  <p>
    <a href="https://github.com/sujeetkc1/testoise"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
    <a href="https://www.npmjs.com/package/testoise"><img src="https://img.shields.io/npm/v/testoise" alt="npm version" /></a>
    <a href="https://github.com/sujeetkc1/testoise/actions"><img src="https://img.shields.io/github/actions/workflow/status/sujeetkc1/testoise/test.yml?branch=main" alt="Build Status" /></a>
  </p>
</div>

---

## The Problem

When writing tests with complex setups, we frequently declare `let` variables at the top of a `describe` block and re-assign them in `beforeEach` to ensure a clean state.

```ts
// ❌ The standard (but annoying) way
describe("User", () => {
    let firstName: string;
    let fullName: string;

    beforeEach(() => {
        firstName = "John";
        fullName = `${firstName} Doe`;
    });

    it("uses default name", () => { /* ... */ });

    describe("when first name changes", () => {
        beforeEach(() => {
            // We have to manually re-evaluate all dependent variables too!
            firstName = "Jane";
            fullName = `${firstName} Doe`;
        });
        
        it("...", () => { /* ... */ });
    });
});
```

As your tests grow, this boilerplate becomes extremely repetitive and brittle. You end up redefining dependent variables multiple times.

If you've ever worked with **Ruby on Rails**, you are likely intimately familiar with **RSpec** and its magical `let` helper, which solved this problem elegantly.

## Our Solution: `testoise`

`testoise` brings the power and elegance of RSpec's `let` directly into the JavaScript testing ecosystem! It provides a structured, reactive way to define context variables that:
1. **Evaluates Lazily**: Your variable factory is only executed when `get()` is called.
2. **Caches Per Test**: The evaluated variable is cached for the duration of a single `it` block.
3. **No Globals**: Explicit imports for `def` and `get` so your testing environment stays clean.
4. **Overrides Cleanly**: Nested `describe` blocks can override a parent's `def`, and all dependent variables automatically react to the change!

## Installation

```bash
bun add -d testoise
# or
npm install --save-dev testoise
# or
pnpm add -D testoise
```

## Basic Usage

Import `def` and `get` from your test runner's specific adapter path (`testoise/bun`, `testoise/vitest`, or `testoise/jest`).

```ts
// tests/basic.test.ts
import { describe, expect, it } from "vitest"; // or "bun:test", "@jest/globals"
import { def, get } from "testoise/vitest"; 

describe("User", () => {
    def("firstName", () => "John");
    def("lastName", () => "Doe");
    
    // Lazy variables can depend on other lazy variables!
    def("fullName", () => `${get<string>("firstName")} ${get<string>("lastName")}`);

    it("uses the default name", () => {
        expect(get<string>("fullName")).toBe("John Doe");
    });

    describe("when first name changes", () => {
        // Overrides the "firstName" variable for this describe block only
        def("firstName", () => "Jane");

        it("automatically updates dependent variables", () => {
            expect(get<string>("fullName")).toBe("Jane Doe");
        });
    });
});
```

---

## Magic in UI Component Testing 🧪

`testoise` shines brightest when testing UI components where you want to render the same component with slightly different props across numerous test cases.

Instead of typing out verbose components every time you render, you can set them once, define your component lazily as a variable, and then override just the specific props you want per test.

### React Testing Library Example

```tsx
// 1. Initial defaults
def("username", () => "Guest");
def("age", () => 30);

// 2. Define the component using the lazy variables
def("component", () => (
    <UserProfile username={get("username")} age={get("age")} />
));

it("renders default", () => {
    render(get("component"));
    // Expect "Guest"
});

describe("testing a specific user", () => {
    // 3. Only override the props that matter for this block!
    def("username", () => "Alice");
    
    // Renders automatically with the new username (Alice) and the old age (30)
    it("renders as Alice", () => {
        render(get("component"));
        // Expect "Alice" 
    }); 
});
```

> For a full runnable React example, jump closely into [`examples/vitest/react.test.tsx`](./examples/vitest/react.test.tsx).

### Vue Test Utils Example

Works identically for Vue. You don't have to manually redefine your `mount(UserProfile)` wrapper every time!

```ts
def("username", () => "Guest");

def("wrapper", () => mount(UserProfile, {
    props: { username: get("username") }
}));

it("renders default", () => {
    const wrapper = get("wrapper");
    // Expect "Guest"
});

describe("testing another user", () => {
    // The wrapper will automatically use "Bob"
    def("username", () => "Bob"); 
    
    it("renders overriden user", () => {
        const wrapper = get("wrapper");
        // Expect "Bob"
    });
});
```

> For a full runnable Vue example, check out [`examples/vitest/vue.test.ts`](./examples/vitest/vue.test.ts).

---

## Setup for different test runners

### Vitest
```ts
import { def, get } from "testoise/vitest";
```

### Bun
```ts
import { def, get } from "testoise/bun";
```

### Jest
```ts
import { def, get } from "testoise/jest";
```

## API Reference

### `def(name: string, factory: () => any): void`
Registers a factory function under `name`. When your test hooks into the `beforeAll` block dynamically, this variable is established for the entire current `describe` scope.


### `get<T>(name: string): T`
Evaluates and returns the result of the factory named `name`. If `get()` is called multiple times inside the same test logic (`it` block), the cached return value is reused to avoid expensive recalculations. Between separate `it` tests, the cache is automatically wiped clean.

## Contributing
1. Clone the repo
2. Run `bun install`
3. Make changes and run tests with `bun run test` (for core) and `bun x vitest` (for UI frameworks)
4. Submit a Pull Request

## License

MIT License
