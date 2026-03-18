import { describe, expect, it } from "@jest/globals";
import { testoise } from "../../src/jest.js";

interface MyVars {
	firstName: string;
	lastName: string;
	fullName: string;
	level: number;
}

/**
 * 🐢 DEEP NESTING EXAMPLE (Jest)
 *
 * Demonstrates type-safe nesting in Jest.
 */
testoise<MyVars>("Jest Level 1", ({ def, get }) => {
	def("firstName", () => "Jest");
	def("lastName", () => "Root");
	def("fullName", () => `${get("firstName")} ${get("lastName")}`);
	def("level", () => 1);

	describe("Jest Level 2", () => {
		def("firstName", () => "Nested");
		def("level", () => 2);

		describe("Jest Level 3", () => {
			def("firstName", () => "Deeply");
			def("level", () => 3);

			it("maintains types in Jest across 3 levels", () => {
				const name = get("fullName");
				expect(name).toBe("Deeply Root");
				expect(get("level")).toBe(3);
			});
		});
	});
});
