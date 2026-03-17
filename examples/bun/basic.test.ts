import { describe, expect, it } from "bun:test";
import { def, get } from "../../src/bun.js";

describe("Bun Basic Usage", () => {
    def("firstName", () => "John");
    def("lastName", () => "Doe");
    def("fullName", () => `${get<string>("firstName")} ${get<string>("lastName")}`);

    it("verifies the default full name", () => {
        expect(get<string>("fullName")).toBe("John Doe");
    });

    describe("when first name is overridden", () => {
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
