---
name: Lazy Evaluation
description: Instructions for using lazy evaluation patterns in test suites, particularly for React and Vue components.
---

# Lazy Evaluation Skill

When writing tests in this codebase or adding tests that use `testoise`, follow these guidelines:

1. **No Globals**: Always import `def` and `get` explicitly from `testoise/vitest`, `testoise/bun`, or `testoise/jest` depending on the test runner.
2. **Lazy Evaluation**: Use `def(name, factory)` to define variables. They are evaluated only when `get(name)` is called.
3. **Component Props**: For UI components, define props as lazy variables, and define the component or wrapper itself as a lazy variable that relies on those props.
4. **Overrides**: In nested `describe` blocks, override just the props you need to change. Do NOT redefine the component wrapper unless necessary.
5. **Scope Isolation**: Variables defined or overridden in a nested `describe` block are strictly scoped. Always verify that they revert to their previous values (or become undefined if not previously defined) when exiting that block.

## React Example
```tsx
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { def, get } from "testoise/vitest";

describe("Component", () => {
    afterEach(() => cleanup());

    def("propA", () => "default");
    def("component", () => <MyComponent propA={get("propA")} />);

    it("renders default", () => {
        render(get("component"));
        // Assertions...
    });

    describe("with override", () => {
        def("propA", () => "overridden");
        it("renders overridden", () => {
            render(get("component"));
            // Assertions...
        });
    });
});
```
