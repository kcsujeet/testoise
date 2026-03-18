import { expect, it } from "bun:test";
import { testoise } from "../../src/bun.js";

interface MyVars {
	firstName: string;
	lastName: string;
	fullName: string;
}

/**
 * 💎 ADVANCED USAGE: The Suite Wrapper
 */
testoise<MyVars>("Bun Advanced Inference", ({ def, get, testoise }) => {
	def("firstName", () => "John");
	def("lastName", () => "Doe");
	def("fullName", () => `${get("firstName")} ${get("lastName")}`);

	it("infers types automatically for strings", () => {
		expect(get("fullName")).toBe("John Doe");
	});

	// Nested suite provided by the API callback!
	testoise("nested with overrides", ({ def, get }) => {
		def("firstName", () => "Jane");

		it("stays typed in nested blocks", () => {
			expect(get("fullName")).toBe("Jane Doe");
		});
	});
});
