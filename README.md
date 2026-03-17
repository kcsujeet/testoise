# get-lazy-var

A lightweight, global-free, TypeScript-first lazy variable library for modern JavaScript testing frameworks (Bun, Vitest, Jest).

## Features
- **No Globals**: Explicit imports for `def` and `get` so your testing environment stays clean. No polluted globals conflicting with each other.
- **Native Test Runner Integration**: Works transparently with Bun, Vitest, and Jest lifecycle hooks (`beforeAll`, `beforeEach`, `afterAll`).
- **Lazy Evaluation**: Evaluates variables only when `get()` is called.
- **Per-Test Caching**: Variables are cached per test execution, preventing duplicate heavy initializations.
- **Scoping**: Variables defined in nested `describe` blocks cleanly override parent variables, and automatically restore when the block finishes.
- **Great for UI Component Testing**: Radically simplifies React and Vue component testing by letting you declaratively define and override props, mock data, and component wrappers.

## Installation

```bash
bun add -d get-lazy-var
# or
npm install --save-dev get-lazy-var
# or
pnpm add -D get-lazy-var
```

## Basic Usage

Import `def` and `get` from your test runner's specific adapter path (`get-lazy-var/bun`, `get-lazy-var/vitest`, or `get-lazy-var/jest`).

```ts
// tests/basic.test.ts
import { describe, expect, it } from "vitest"; // or "bun:test", "@jest/globals"
import { def, get } from "get-lazy-var/vitest"; 

describe("User Profile logic", () => {
    // Defines a lazy variable "username"
    def("username", () => "default_user");
    
    // Lazy variables can depend on other lazy variables!
    def("apiEndpoint", () => `https://api.example.com/users/${get<string>("username")}`);

    it("uses the default username", () => {
        expect(get<string>("apiEndpoint")).toBe("https://api.example.com/users/default_user");
    });

    describe("when testing an admin user", () => {
        // Overrides the "username" variable for this describe block only
        def("username", () => "admin");

        it("automatically updates dependent variables", () => {
            expect(get<string>("apiEndpoint")).toBe("https://api.example.com/users/admin");
        });
    });
});
```

## Usage in React Component Testing

`get-lazy-var` shines when testing UI components where you want to render the same component with slightly different props across numerous test cases.

```tsx
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { def, get } from "get-lazy-var/vitest";

const UserProfile = ({ username, age }: { username: string; age: number }) => (
    <div>
        <h1>Profile: {username}</h1>
        <p>Age: {age}</p>
    </div>
);

describe("UserProfile", () => {
    afterEach(() => cleanup());

    def("username", () => "Guest");
    def("age", () => 30);
    
    // The component wrapper reactively uses the other lazy variables.
    def("component", () => (
        <UserProfile username={get<string>("username")} age={get<number>("age")} />
    ));

    it("renders with default props", () => {
        render(get<React.ReactElement>("component"));
        expect(screen.getByText("Profile: Guest")).toBeDefined();
    });

    describe("when the user is Alice", () => {
        // Just override the prop you care about! 
        def("username", () => "Alice");

        it("picks up the overriden username automatically", () => {
            // "component" automatically reflects the overridden "username"
            render(get<React.ReactElement>("component"));
            expect(screen.getByText("Profile: Alice")).toBeDefined();
        });
    });
});
```

## Usage in Vue Component Testing

Works identically for Vue using `@vue/test-utils`.

```ts
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { def, get } from "get-lazy-var/vitest";

const UserProfile = defineComponent({
    props: ["username"],
    render() {
        return h("div", `Profile: ${this.username}`);
    },
});

describe("UserProfile Vue Component", () => {
    def("username", () => "Guest");
    def("wrapper", () => mount(UserProfile, {
        props: { username: get<string>("username") }
    }));

    it("renders default", () => {
        expect(get<any>("wrapper").text()).toContain("Profile: Guest");
    });

    describe("with different user", () => {
        def("username", () => "Bob");
        it("renders overridden user", () => {
            expect(get<any>("wrapper").text()).toContain("Profile: Bob");
        });
    });
});
```
