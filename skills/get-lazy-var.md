---
name: Use get-lazy-var for Lazy Evaluation
description: Instructions for using the get-lazy-var library in test suites, especially for React and Vue components.
---

# get-lazy-var Skill

When writing tests in this codebase or adding tests that use `get-lazy-var`, follow these guidelines:

1. **No Globals**: Always import `def` and `get` explicitly from `get-lazy-var/vitest`, `get-lazy-var/bun`, or `get-lazy-var/jest` depending on the test runner.
2. **Lazy Evaluation**: Use `def(name, factory)` to define variables. They are evaluated only when `get(name)` is called.
3. **Component Props**: For UI components, define props as lazy variables, and define the component or wrapper itself as a lazy variable that relies on those props.
4. **Overrides**: In nested `describe` blocks, override just the props you need to change. Do NOT redefine the component wrapper unless necessary.

## React Example
```tsx
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { def, get } from "get-lazy-var/vitest";

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
