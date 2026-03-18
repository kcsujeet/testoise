import { expect, it } from "vitest";
import { testoise } from "../../src/vitest.js";

interface MyVars {
	firstName: string;
	lastName: string;
	fullName: string;
	counter: number;
}

/**
 * 💎 ADVANCED USAGE: The Suite Wrapper
 * 
 * Provides automatic type inference for string-literal keys
 * by passing a Registry interface to testoise<Registry>().
 */
testoise<MyVars>("Vitest Advanced Inference", ({ def, get, testoise }) => {
	def("firstName", () => "John");
	def("lastName", () => "Doe");

	// Types are automatically inferred as strings!
	def("fullName", () => `${get("firstName")} ${get("lastName")}`);

	it("infers types automatically for strings", () => {
		const name = get("fullName");
		expect(name).toBe("John Doe");
	});

	// Nested suite provided by the API callback maintains the registry!
	testoise("nested with overrides", ({ def, get }) => {
		def("firstName", () => "Jane");

		it("stays typed in nested blocks", () => {
			expect(get("fullName")).toBe("Jane Doe");
		});
	});
});
