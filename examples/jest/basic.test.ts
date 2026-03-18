import { describe, expect, it } from "@jest/globals";
import { def, get } from "../../src/jest.js";

describe("Jest Basic Usage", () => {
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

        it("automatically updates dependent variables", () => {
            expect(get<string>("fullName")).toBe("Jane Doe");
        });

        it("stays overridden in this block", () => {
            expect(get<string>("firstName")).toBe("Jane");
        });
    });

    it("reverts to John Doe after the nested block", () => {
        expect(get<string>("fullName")).toBe("John Doe");
    });
});
