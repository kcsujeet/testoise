<div align="center">
  <h1>🐢 testoise</h1>
  <p><strong>RSpec inspired light weight and fully type-safe lazy test variables for modern JS (Bun, Vitest, Jest). <br/> Effortless, scoped, and reactive.</strong></p>

  <p>
    <a href="https://github.com/kcsujeet/testoise"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
    <a href="https://www.npmjs.com/package/@ilamy/testoise"><img src="https://img.shields.io/npm/v/@ilamy/testoise" alt="npm version" /></a>
  </p>
</div>

---

## The Problem

When writing tests with complex setups, we frequently declare `let` variables and re-assign them in `beforeEach`. This is repetitive and brittle.

```ts
// ❌ The standard (but annoying) way
import { describe, beforeEach, it } from "vitest";

describe("User", () => {
    let firstName: string;
    let fullName: string;

    beforeEach(() => {
        firstName = "John";
        fullName = `${firstName} Doe`;
    });

    describe("when first name changes", () => {
        beforeEach(() => {
            firstName = "Jane";
            fullName = `${firstName} Doe`; // Manual re-evaluation!
        });
        
        it("is updated", () => { /* ... */ });
    });
});
```

## Our Solution: `testoise`

`testoise` brings the power and elegance of RSpec's `let` directly into JavaScript!
1. **Evaluates Lazily**: Factory is only executed upon `get()`.
2. **Caches Per Test**: Return value is cached for the duration of a single `it` block.
3. **Overrides Cleanly**: Nested blocks override parents; dependents react automatically.

## Installation

```bash
bun add -d @ilamy/testoise # or npm install --save-dev @ilamy/testoise
```

---

## Basic Usage

Import `def` and `get` from your test runner's specific adapter path (`@ilamy/testoise/bun`, `@ilamy/testoise/vitest`, or `@ilamy/testoise/jest`).

```ts
import { describe, expect, it } from "vitest"; 
import { def, get } from "@ilamy/testoise/vitest"; 

describe("User", () => {
    // 1. Define base lazy variables
    def("firstName", () => "John");
    def("lastName", () => "Doe");
    
    // 2. Variables can depend on other lazy variables!
    def("fullName", () => `${get("firstName")} ${get("lastName")}`);

    it("uses the default name", () => {
        // Manual type casting for those not using the suite wrapper
        expect(get<string>("fullName")).toBe("John Doe");
    });

    describe("when first name changes", () => {
        // 3. Overrides the "firstName" variable for this describe block only
        def("firstName", () => "Jane");

        it("automatically updates dependent variables", () => {
            expect(get<string>("fullName")).toBe("Jane Doe");
        });
    });
});
```

---

## 📂 Examples

Explore our [examples/](file:///Users/sujeetkc1/Desktop/get-lazy-var/examples) directory for practical, framework-specific setups:
- [Bun Examples](file:///Users/sujeetkc1/Desktop/get-lazy-var/examples/bun): Native Bun testing with DOM support.
- [Vitest Examples](file:///Users/sujeetkc1/Desktop/get-lazy-var/examples/vitest): Vitest integration with `happy-dom`.
- [Jest Examples](file:///Users/sujeetkc1/Desktop/get-lazy-var/examples/jest): Jest integration with `jsdom` and SWC.

---

## 💎 Automatic Type Inference

For strong type inference without manual casting, `testoise` provides a **Suite Wrapper**. This is the recommended way to use `testoise` in TypeScript projects.

```ts
import { expect, it } from "vitest";
import { testoise } from "@ilamy/testoise/vitest";

// 1. Define your registry
interface MyVars {
  user: { name: string; age: number };
  isAdmin: boolean;
}

// 2. Use the wrapper for automatic inference 🐢🚀
testoise<MyVars>("User Suite", ({ def, get, testoise }) => {
  def("user", () => ({ name: "Alice", age: 30 }));
  def("isAdmin", () => get("user").age > 21);

  it("knows Alice is an adult", () => {
    const user = get("user"); // Automatically inferred as { name: string; age: number }!
    expect(get("isAdmin")).toBe(true);
  });

  // Nesting is supported and maintains types!
  testoise("when user is underage", ({ def, get }) => {
    def("user", () => ({ name: "Bob", age: 15 }));

    it("knows Bob is not an admin", () => {
      expect(get("isAdmin")).toBe(false);
    });
  });
});
```

> [!TIP]
> The suite wrapper ensures that your variable names and types are always in sync, preventing runtime errors and providing a premium developer experience.

---

## Support Matrix

| Feature | Vitest | Bun | Jest |
| :--- | :---: | :---: | :---: |
| Lazy Evaluation | ✅ | ✅ | ✅ |
| Context Nesting | ✅ | ✅ | ✅ |
| Automatic Inference | ✅ | ✅ | ✅ |
| Redefinition Protection | ✅ | ✅ | ✅ |
| React Support | ✅ | ✅ | ✅ |
| Vue Support | ✅ | ✅ | ✅ |

---

## API Reference

### `def(name: string, factory: () => T): string`
Registers a variable.

### `get<T>(name: string): T`
Evaluates and returns the factory result. Caches per test. Supports manual type casting: `get<string>("name")`.

### `testoise<Registry>(name, suite): void`
Suite wrapper for simplified type inference across a suite. Provides a typed `api` with its own `def`, `get`, and `testoise` methods.

---

## License

MIT © [Sujeet KC](https://github.com/kcsujeet)
