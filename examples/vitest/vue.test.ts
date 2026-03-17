import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { def, get } from "../../src/vitest.js";

// A simple Vue component
const UserProfile = defineComponent({
	props: ["username", "age"],
	render() {
		return h("div", [
			h("h1", `Profile: ${this.username}`),
			h("p", `Age: ${this.age}`),
		]);
	},
});

describe("Vue Component Testing with testoise", () => {
	// Define lazy variables for component props
	def("username", () => "Guest");
	def("age", () => 30);

	// Define the wrapper using the lazy variables
	def("wrapper", () => {
		return mount(UserProfile, {
			props: {
				username: get<string>("username"),
				age: get<number>("age"),
			},
		});
	});

	it("renders with default props", () => {
		// biome-ignore lint/suspicious/noExplicitAny: false positive
		const wrapper = get<any>("wrapper");
		expect(wrapper.text()).toContain("Profile: Guest");
		expect(wrapper.text()).toContain("Age: 30");
	});

	describe("when user is logged in", () => {
		// Override lazy variables
		def("username", () => "Bob");
		def("age", () => 40);

		it("renders the new user without needing to redefine the wrapper", () => {
			// biome-ignore lint/suspicious/noExplicitAny: false positive
			const wrapper = get<any>("wrapper");
			expect(wrapper.text()).toContain("Profile: Bob");
			expect(wrapper.text()).toContain("Age: 40");
		});

		describe("and is in a special promotion", () => {
			// Deeply nested override
			def("username", () => "VIP Bob");

			it("renders the VIP status", () => {
				// biome-ignore lint/suspicious/noExplicitAny: false positive
				const wrapper = get<any>("wrapper");
				expect(wrapper.text()).toContain("Profile: VIP Bob");
				expect(wrapper.text()).toContain("Age: 40");
			});
		});

		it("reverts back to original Bob profile after the promotion block", () => {
			// biome-ignore lint/suspicious/noExplicitAny: false positive
			const wrapper = get<any>("wrapper");
			expect(wrapper.text()).toContain("Profile: Bob");
		});
	});

	it("reverts to Guest profile after all logged-in blocks finish", () => {
		// biome-ignore lint/suspicious/noExplicitAny: false positive
		const wrapper = get<any>("wrapper");
		expect(wrapper.text()).toContain("Profile: Guest");
		expect(wrapper.text()).toContain("Age: 30");
	});
});
