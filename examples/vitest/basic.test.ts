import { describe, expect, it } from "vitest";
import { def, get } from "../../src/vitest.js";

describe("Vitest Basic Usage", () => {
    // 1. Define base lazy variables
    def("firstName", () => "John");
    def("lastName", () => "Doe");
    
    // 2. Variables can depend on other variables!
    def("fullName", () => `${get<string>("firstName")} ${get<string>("lastName")}`);

    it("verifies the default full name", () => {
        expect(get<string>("fullName")).toBe("John Doe");
    });

    describe("when first name is overridden", () => {
        // 3. Nested override
        def("firstName", () => "Jane");

        it("automatically updates dependent variables (fullName)", () => {
            expect(get<string>("fullName")).toBe("Jane Doe");
        });

        describe("when both are overridden", () => {
            // 4. Even deeper nesting
            def("lastName", () => "Smith");

            it("uses both overrides", () => {
                expect(get<string>("fullName")).toBe("Jane Smith");
            });
        });

        it("returns to previous state (Jane Doe) after the even deeper nest", () => {
            expect(get<string>("fullName")).toBe("Jane Doe");
        });
    });

    it("reverts completely to John Doe after all nested blocks", () => {
        expect(get<string>("fullName")).toBe("John Doe");
    });
    
    describe("caching behavior", () => {
        let count = 0;
        def("counter", () => {
            count++;
            return count;
        });

        it("caches the value for the duration of a single test", () => {
            expect(get<number>("counter")).toBe(1);
            expect(get<number>("counter")).toBe(1); // Cached
            expect(count).toBe(1);
        });

        it("resets the cache between different tests", () => {
            expect(get<number>("counter")).toBe(2);
            expect(count).toBe(2);
        });
    });
});
