import { describe, expect, it } from "bun:test";
import { testoise } from "../../src/bun.js";

interface MyVars {
	firstName: string;
	lastName: string;
	fullName: string;
	level: number;
}

/**
 * 🐢 DEEP NESTING EXAMPLE (Bun)
 *
 * Demonstrates type-safe nesting in Bun.
 */
testoise<MyVars>("Bun Level 1", ({ def, get }) => {
	def("firstName", () => "Bun");
	def("lastName", () => "Root");
	def("fullName", () => `${get("firstName")} ${get("lastName")}`);
	def("level", () => 1);

	// Now you can use standard describe with outer def/get! 🐢💎
	describe("Bun Level 2", () => {
		def("firstName", () => "Nested");
		def("level", () => 2);

		describe("Bun Level 3", () => {
			def("firstName", () => "Deeply");
			def("level", () => 3);

			it("maintains types in Bun across 3 levels", () => {
				const name = get("fullName");
				expect(name).toBe("Deeply Root");
				expect(get("level")).toBe(3);
			});
		});
	});
});
