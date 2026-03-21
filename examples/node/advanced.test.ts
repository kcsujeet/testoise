import assert from "node:assert";
import { describe, it } from "node:test";
import { testoise } from "../../src/node.js";

interface MyVars {
	firstName: string;
	lastName: string;
	fullName: string;
}

/**
 * 💎 ADVANCED USAGE: The Suite Wrapper (Node.js)
 */
testoise<MyVars>("Node.js Advanced Inference", ({ def, get }) => {
	def("firstName", () => "John");
	def("lastName", () => "Doe");
	def("fullName", () => `${get("firstName")} ${get("lastName")}`);

	it("infers types automatically for strings", () => {
		const name: string = get("fullName");
		assert.strictEqual(name, "John Doe");
	});

	describe("nested with overrides", () => {
		def("firstName", () => "Jane");

		it("stays typed in nested blocks", () => {
			const name: string = get("fullName");
			assert.strictEqual(name, "Jane Doe");
		});
	});
});
