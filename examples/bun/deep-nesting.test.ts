import { expect, it } from "bun:test";
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
testoise<MyVars>("Bun Level 1", ({ def, get, testoise }) => {
	def("firstName", () => "Bun");
	def("lastName", () => "Root");
	def("fullName", () => `${get("firstName")} ${get("lastName")}`);
	def("level", () => 1);

	testoise("Bun Level 2", ({ def, get, testoise }) => {
		def("firstName", () => "Nested");
		def("level", () => 2);

		testoise("Bun Level 3", ({ def, get }) => {
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
