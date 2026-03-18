import { describe, expect, it } from "bun:test";
import { def, get } from "../src/bun.js";

describe("Jest def and get", () => {
	def("a", () => 1);
	def("b", () => get<number>("a") + 1);

	describe("evaluates lazily", () => {
		let evalCount = 0;
		def("lazy", () => {
			evalCount++;
			return 10;
		});

		it("only calls factory upon get", () => {
			expect(evalCount).toBe(0);
			expect(get<number>("lazy")).toBe(10);
			expect(evalCount).toBe(1);
		});
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
