import assert from "node:assert";
import { describe, it } from "node:test";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { def, get } from "../../src/node.js";

const UserProfile = defineComponent({
	props: ["username", "age"],
	render() {
		return h("div", [
			h("h1", `Profile: ${this.username}`),
			h("p", `Age: ${this.age}`),
		]);
	},
});

describe("Node.js + Vue Component Testing with testoise", () => {
	def("username", () => "Guest");
	def("age", () => 30);

	def("wrapper", () => {
		return mount(UserProfile, {
			props: {
				username: get<string>("username"),
				age: get<number>("age"),
			},
		});
	});

	it("renders with default props", () => {
		const wrapper = get("wrapper");
		assert.ok(wrapper.text().includes("Profile: Guest"));
		assert.ok(wrapper.text().includes("Age: 30"));
	});

	describe("when user is logged in", () => {
		def("username", () => "Bob");
		def("age", () => 40);

		it("renders the new user without needing to redefine the wrapper", () => {
			const wrapper = get("wrapper");
			assert.ok(wrapper.text().includes("Profile: Bob"));
			assert.ok(wrapper.text().includes("Age: 40"));
		});
	});
});
