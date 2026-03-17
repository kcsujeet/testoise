import { describe, expect, it, vi } from "vitest";
import { def, get } from "../src/vitest.js";

describe("Vitest def and get", () => {
	def("a", () => 1);
	def("b", () => get<number>("a") + 1);

	it("evaluates lazily", () => {
		const _factory = vi.fn(() => 10);
	});

	describe("returns values correctly", () => {
		def("c", () => 3);
		it("works", () => {
			expect(get<number>("a")).toBe(1);
			expect(get<number>("b")).toBe(2);
			expect(get<number>("c")).toBe(3);
		});
	});

	describe("caches per test execution", () => {
		let callCount = 0;
		def("cached", () => {
			callCount++;
			return "val";
		});

		it("caches", () => {
			expect(get<string>("cached")).toBe("val");
			expect(get<string>("cached")).toBe("val");
			expect(callCount).toBe(1);
		});
	});

	describe("nested", () => {
		def("a", () => 2); // override

		it("uses nearest context", () => {
			expect(get<number>("a")).toBe(2);
			expect(get<number>("b")).toBe(3); // b depends on a
		});
	});

	describe("another nested", () => {
		it("uses original context", () => {
			expect(get<number>("a")).toBe(1); // not overridden here
			expect(get<number>("b")).toBe(2);
		});
	});
});
