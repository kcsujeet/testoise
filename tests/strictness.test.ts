import { describe, expect, it } from "vitest";
import { def, get, testoise } from "../src/vitest.js";

describe("TypeScript Inference & Strictness", () => {
	interface MyRegistry {
		foo: number;
		bar: string;
	}

	testoise<MyRegistry>("Type Inference (Suite Wrapper)", ({ def, get }) => {
		def("foo", () => 100);
		def("bar", () => "baz");

		it("infers types from the registry interface", () => {
			const foo = get("foo"); // inferred as number
			const bar = get("bar"); // inferred as string
			expect(foo).toBe(100);
			expect(bar).toBe("baz");
		});
	});

	describe("Redefinition Protection", () => {
		it("throws an error when defining the same variable twice in the same scope", async () => {
			const { defineVar, pushContext } = await import("../src/core.js");
			pushContext(); // start a fresh scope

			expect(() => {
				defineVar("dup", () => 1);
				defineVar("dup", () => 2);
			}).toThrow('Lazy variable "dup" is already defined in this scope');
		});

		it("allows overrides in nested scopes", () => {
			def("scoped", () => "outer");
			describe("inner", () => {
				def("scoped", () => "inner");
				it("works", () => {
					expect(get("scoped")).toBe("inner");
				});
			});
		});
	});
});
