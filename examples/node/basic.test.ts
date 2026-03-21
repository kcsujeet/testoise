import assert from "node:assert";
import { describe, it } from "node:test";
import { def, get } from "../../src/node.js";

describe("Node.js Basic Usage", () => {
	def("firstName", () => "Node");
	def("lastName", () => "Runner");
	def("fullName", () => `${get("firstName")} ${get("lastName")}`);

	it("verifies the default full name", () => {
		assert.strictEqual(get("fullName"), "Node Runner");
	});

	describe("when first name is overridden", () => {
		def("firstName", () => "CommonJS"); // or ESM in this case

		it("automatically updates dependent variables", () => {
			assert.strictEqual(get("fullName"), "CommonJS Runner");
		});
	});

	it("reverts to Node Runner after the nested block", () => {
		assert.strictEqual(get("fullName"), "Node Runner");
	});
});
