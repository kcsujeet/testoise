import { describe, expect, it } from "vitest";
import { testoise } from "../../src/vitest.js";

interface MyVars {
	firstName: string;
	lastName: string;
	fullName: string;
	level: number;
}

/**
 * 🐢 DEEP NESTING EXAMPLE
 *
 * This example demonstrates how the `testoise` provided in the callback
 * preserves your Registry types across multiple levels of nesting.
 */
testoise<MyVars>("Level 1: Root Suite", ({ def, get }) => {
	def("firstName", () => "Root");
	def("lastName", () => "User");
	def("fullName", () => `${get("firstName")} ${get("lastName")}`);
	def("level", () => 1);

	it("works at root level", () => {
		expect(get("fullName")).toBe("Root User");
		expect(get("level")).toBe(1);
	});

	describe("Level 2: First Nesting", () => {
		def("firstName", () => "Level2");
		def("level", () => 2);

		it("overrides work at level 2", () => {
			expect(get("fullName")).toBe("Level2 User");
			expect(get("level")).toBe(2);
		});

		describe("Level 3: Deep Nesting", () => {
			def("firstName", () => "Level3");
			def("level", () => 3);

			it("overrides work at level 3", () => {
				expect(get("fullName")).toBe("Level3 User");
				expect(get("level")).toBe(3);
			});

			describe("Level 4: Abyssal Nesting 🌊", () => {
				def("firstName", () => "Abyssal");
				def("level", () => 4);

				it("is STILL type-safe at level 4!", () => {
					// All these are perfectly inferred automatically!
					const name = get("fullName");
					const lvl = get("level");

					expect(name).toBe("Abyssal User");
					expect(lvl).toBe(4);
				});
			});
		});
	});
});
