import { mount } from "@vue/test-utils";
import { describe, expect, it } from "bun:test";
import { defineComponent, h } from "vue";
import { def, get } from "../../src/bun.js";

const UserProfile = defineComponent({
	props: ["username", "age"],
	render() {
		return h("div", [
			h("h1", `Profile: ${this.username}`),
			h("p", `Age: ${this.age}`),
		]);
	},
});

describe("Bun + Vue Component Testing with testoise", () => {
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
		expect(wrapper.text()).toContain("Profile: Guest");
		expect(wrapper.text()).toContain("Age: 30");
	});

	describe("when user is logged in", () => {
		def("username", () => "Bob");
		def("age", () => 40);

		it("renders the new user without needing to redefine the wrapper", () => {
			const wrapper = get("wrapper");
			expect(wrapper.text()).toContain("Profile: Bob");
			expect(wrapper.text()).toContain("Age: 40");
		});
	});
});
