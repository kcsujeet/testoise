import assert from "node:assert";
import { describe, it } from "node:test";
import { testoise } from "../../src/node.js";

interface MyVars {
	firstName: string;
	lastName: string;
	fullName: string;
	level: number;
}

/**
 * 🐢 DEEP NESTING EXAMPLE (Node.js)
 *
 * Demonstrates type-safe nesting in Node.js.
 */
testoise<MyVars>("Node Level 1", ({ def, get }) => {
	def("firstName", () => "Node");
	def("lastName", () => "Root");
	def("fullName", () => `${get("firstName")} ${get("lastName")}`);
	def("level", () => 1);

	// Now you can use standard describe with outer def/get! 🐢💎
	describe("Node Level 2", () => {
		def("firstName", () => "Nested");
		def("level", () => 2);

		describe("Node Level 3", () => {
			def("firstName", () => "Deeply");
			def("level", () => 3);

			it("maintains types in Node across 3 levels", () => {
				const name = get("fullName");
				assert.strictEqual(name, "Deeply Root");
				assert.strictEqual(get("level"), 3);
			});
		});
	});
});
